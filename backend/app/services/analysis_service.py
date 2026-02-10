from __future__ import annotations

import uuid
import asyncio
import traceback
from datetime import datetime
from typing import Dict

from tradingagents.graph.trading_graph import TradingAgentsGraph
from tradingagents.default_config import DEFAULT_CONFIG

from app.models import (
    AnalysisJob,
    AnalysisRequest,
    AnalysisResult,
    InvestDebateResult,
    RiskDebateResult,
    LLMProvider,
    JobStatus,
    JobSummary,
    ProgressStep,
    StepStatus,
)
from app.services.supabase_client import get_supabase


# ── Progress step definitions ────────────────────────────────────────────────

_ANALYST_STEPS = {
    "market":       ("market_analyst",       "市場分析師"),
    "social":       ("social_analyst",       "社群情緒分析師"),
    "news":         ("news_analyst",         "新聞分析師"),
    "fundamentals": ("fundamentals_analyst", "基本面分析師"),
}

_FIXED_STEPS = [
    ("invest_debate",    "多空辯論"),
    ("research_manager", "研究主管決策"),
    ("trader",           "交易員決策"),
    ("risk_debate",      "風險辯論"),
    ("final_decision",   "最終決策"),
]

# Map step keys to the state field that holds their content
_STEP_CONTENT_FIELD = {
    "market_analyst":       "market_report",
    "social_analyst":       "sentiment_report",
    "news_analyst":         "news_report",
    "fundamentals_analyst": "fundamentals_report",
}


def _build_progress(analysts: list) -> list[ProgressStep]:
    steps = []
    for a in analysts:
        key, label = _ANALYST_STEPS.get(a.value, (None, None))
        if key:
            steps.append(ProgressStep(key=key, label=label))
    for key, label in _FIXED_STEPS:
        steps.append(ProgressStep(key=key, label=label))
    return steps


def _update_step(job: AnalysisJob, key: str, status: StepStatus,
                 content: str | None = None) -> None:
    """Thread-safe step update via atomic list replacement."""
    if job.progress is None:
        return
    new_progress = [s.model_copy() for s in job.progress]
    for s in new_progress:
        if s.key == key:
            s.status = status
            if content is not None:
                s.content = content
            break
    job.progress = new_progress


def _mark_next_running(job: AnalysisJob, after_key: str) -> None:
    """Mark the first pending step after `after_key` as running."""
    if job.progress is None:
        return
    found = False
    for s in job.progress:
        if s.key == after_key:
            found = True
            continue
        if found and s.status == StepStatus.pending:
            _update_step(job, s.key, StepStatus.running)
            break


def _detect_and_apply(job: AnalysisJob, prev: dict, curr: dict,
                      completed_keys: set) -> None:
    """Diff two state snapshots and update job progress accordingly."""

    def _new(field: str) -> bool:
        return bool(curr.get(field)) and not bool(prev.get(field))

    # Analyst reports
    for step_key, field in _STEP_CONTENT_FIELD.items():
        if step_key not in completed_keys and _new(field):
            _update_step(job, step_key, StepStatus.done, curr.get(field, ""))
            _mark_next_running(job, step_key)
            completed_keys.add(step_key)

    # Investment debate
    curr_inv = curr.get("investment_debate_state", {})
    prev_inv = prev.get("investment_debate_state", {})

    if "invest_debate" not in completed_keys:
        if curr_inv.get("count", 0) > prev_inv.get("count", 0):
            history = curr_inv.get("history", "")
            _update_step(job, "invest_debate", StepStatus.running, history)
            completed_keys.discard("invest_debate")  # keep running

    if "research_manager" not in completed_keys:
        if curr_inv.get("judge_decision") and not prev_inv.get("judge_decision"):
            # Mark debate done with final history
            _update_step(job, "invest_debate", StepStatus.done,
                         curr_inv.get("history", ""))
            completed_keys.add("invest_debate")
            # Mark research manager done
            _update_step(job, "research_manager", StepStatus.done,
                         curr_inv.get("judge_decision", ""))
            _mark_next_running(job, "research_manager")
            completed_keys.add("research_manager")

    # Investment plan (part of research_manager output)
    if _new("investment_plan") and "research_manager" in completed_keys:
        # Update research_manager content to include investment plan
        for s in (job.progress or []):
            if s.key == "research_manager":
                plan = curr.get("investment_plan", "")
                combined = (s.content or "") + "\n\n---\n\n**投資計畫：**\n" + plan
                _update_step(job, "research_manager", StepStatus.done, combined)
                break

    # Trader
    if "trader" not in completed_keys and _new("trader_investment_plan"):
        _update_step(job, "trader", StepStatus.done,
                     curr.get("trader_investment_plan", ""))
        _mark_next_running(job, "trader")
        completed_keys.add("trader")

    # Risk debate
    curr_risk = curr.get("risk_debate_state", {})
    prev_risk = prev.get("risk_debate_state", {})

    if "risk_debate" not in completed_keys:
        if curr_risk.get("count", 0) > prev_risk.get("count", 0):
            history = curr_risk.get("history", "")
            _update_step(job, "risk_debate", StepStatus.running, history)

    if "final_decision" not in completed_keys:
        if curr_risk.get("judge_decision") and not prev_risk.get("judge_decision"):
            _update_step(job, "risk_debate", StepStatus.done,
                         curr_risk.get("history", ""))
            completed_keys.add("risk_debate")

    # Final decision
    if "final_decision" not in completed_keys and _new("final_trade_decision"):
        _update_step(job, "final_decision", StepStatus.done,
                     curr.get("final_trade_decision", ""))
        completed_keys.add("final_decision")


# ── Supabase helpers ─────────────────────────────────────────────────────────

def _row_to_job(row: dict) -> AnalysisJob:
    """Convert a Supabase row dict into an AnalysisJob model."""
    from app.models import AnalystType

    analysts_raw = row.get("analysts") or []
    analysts = [AnalystType(a) for a in analysts_raw]

    result = None
    if row.get("result"):
        result = AnalysisResult(**row["result"])

    progress = None
    if row.get("progress"):
        progress = [ProgressStep(**p) for p in row["progress"]]

    return AnalysisJob(
        id=row["id"],
        status=JobStatus(row["status"]),
        ticker=row["ticker"],
        date=row["date"],
        analysts=analysts,
        max_debate_rounds=row.get("max_debate_rounds", 1),
        max_risk_discuss_rounds=row.get("max_risk_discuss_rounds", 1),
        llm_provider=LLMProvider(row.get("llm_provider", "openai")),
        created_at=row["created_at"],
        completed_at=row.get("completed_at"),
        result=result,
        error=row.get("error"),
        progress=progress,
    )


def _row_to_summary(row: dict) -> JobSummary:
    """Convert a Supabase row dict into a JobSummary (lightweight, no result)."""
    from app.models import AnalystType

    analysts_raw = row.get("analysts") or []
    analysts = [AnalystType(a) for a in analysts_raw]

    return JobSummary(
        id=row["id"],
        status=JobStatus(row["status"]),
        ticker=row["ticker"],
        date=row["date"],
        analysts=analysts,
        llm_provider=LLMProvider(row.get("llm_provider", "openai")),
        signal=row.get("signal"),
        created_at=row["created_at"],
        completed_at=row.get("completed_at"),
        error=row.get("error"),
    )


class AnalysisService:
    """Supabase-backed job store and TradingAgentsGraph runner."""

    # In-memory cache for running jobs only (progress updates during analysis)
    def __init__(self) -> None:
        self._running_jobs: Dict[str, AnalysisJob] = {}

    # ── public API ────────────────────────────────────────────────────────

    def create_job(self, req: AnalysisRequest, user_id: str) -> AnalysisJob:
        job_id = uuid.uuid4().hex[:12]
        now = datetime.utcnow().isoformat()

        row = {
            "id": job_id,
            "user_id": user_id,
            "status": "pending",
            "ticker": req.ticker.upper(),
            "date": req.date,
            "analysts": [a.value for a in req.analysts],
            "max_debate_rounds": req.max_debate_rounds,
            "max_risk_discuss_rounds": req.max_risk_discuss_rounds,
            "llm_provider": req.llm_provider.value,
            "created_at": now,
        }

        sb = get_supabase()
        resp = sb.table("analysis_jobs").insert(row).execute()
        inserted = resp.data[0]

        # Deduct 1 credit
        sb.table("credit_transactions").insert({
            "user_id": user_id,
            "amount": -1,
            "reason": "analysis",
            "job_id": job_id,
        }).execute()
        profile = sb.table("profiles").select("credits").eq("id", user_id).single().execute()
        new_credits = profile.data["credits"] - 1
        sb.table("profiles").update({"credits": new_credits}).eq("id", user_id).execute()

        return _row_to_job(inserted)

    def get_job(self, job_id: str, user_id: str | None = None) -> AnalysisJob | None:
        # If job is currently running, return in-memory version (has live progress)
        if job_id in self._running_jobs:
            return self._running_jobs[job_id]

        sb = get_supabase()
        query = sb.table("analysis_jobs").select("*").eq("id", job_id)
        if user_id:
            query = query.eq("user_id", user_id)
        resp = query.execute()

        if not resp.data:
            return None
        return _row_to_job(resp.data[0])

    def list_jobs(self, user_id: str) -> list[JobSummary]:
        sb = get_supabase()
        resp = (
            sb.table("analysis_jobs")
            .select("id, status, ticker, date, analysts, llm_provider, signal, created_at, completed_at, error")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
        return [_row_to_summary(row) for row in resp.data]

    # ── background runner (called from BackgroundTasks) ───────────────────

    async def run_analysis(self, job_id: str) -> None:
        sb = get_supabase()
        resp = sb.table("analysis_jobs").select("*").eq("id", job_id).execute()
        if not resp.data:
            return

        job = _row_to_job(resp.data[0])

        # Initialize progress steps
        job.progress = _build_progress(job.analysts)
        if job.progress:
            _update_step(job, job.progress[0].key, StepStatus.running)

        job.status = JobStatus.running

        # Keep in memory for live progress polling
        self._running_jobs[job_id] = job

        # Persist running status + initial progress
        sb.table("analysis_jobs").update({
            "status": "running",
            "progress": [s.model_dump() for s in job.progress] if job.progress else None,
        }).eq("id", job_id).execute()

        try:
            result = await asyncio.to_thread(self._run_sync, job)
            job.result = result
            job.status = JobStatus.completed
            # Ensure all steps marked done
            if job.progress:
                for s in job.progress:
                    if s.status != StepStatus.done:
                        _update_step(job, s.key, StepStatus.done)

            # Persist final result
            now = datetime.utcnow().isoformat()
            sb.table("analysis_jobs").update({
                "status": "completed",
                "signal": result.signal,
                "result": result.model_dump(),
                "progress": [s.model_dump() for s in job.progress] if job.progress else None,
                "completed_at": now,
            }).eq("id", job_id).execute()

        except Exception:
            error_msg = traceback.format_exc()
            job.error = error_msg
            job.status = JobStatus.failed

            now = datetime.utcnow().isoformat()
            sb.table("analysis_jobs").update({
                "status": "failed",
                "error": error_msg,
                "progress": [s.model_dump() for s in job.progress] if job.progress else None,
                "completed_at": now,
            }).eq("id", job_id).execute()

            # Refund credit on failure
            user_id = resp.data[0]["user_id"]
            sb.table("credit_transactions").insert({
                "user_id": user_id,
                "amount": 1,
                "reason": "refund",
                "job_id": job_id,
            }).execute()
            profile = sb.table("profiles").select("credits").eq("id", user_id).single().execute()
            new_credits = profile.data["credits"] + 1
            sb.table("profiles").update({"credits": new_credits}).eq("id", user_id).execute()

        finally:
            # Remove from in-memory cache
            self._running_jobs.pop(job_id, None)

    # ── sync wrapper executed in thread pool ──────────────────────────────

    # Provider-specific default models
    _PROVIDER_DEFAULTS = {
        LLMProvider.openai: {
            "llm_provider": "openai",
            "deep_think_llm": "o4-mini",
            "quick_think_llm": "gpt-4o-mini",
            "backend_url": "https://api.openai.com/v1",
        },
        LLMProvider.google: {
            "llm_provider": "google",
            "deep_think_llm": "gemini-2.0-flash",
            "quick_think_llm": "gemini-2.0-flash",
            "backend_url": "",  # Google SDK handles URL internally
        },
    }

    @staticmethod
    def _run_sync(job: AnalysisJob) -> AnalysisResult:
        config = DEFAULT_CONFIG.copy()
        config["max_debate_rounds"] = job.max_debate_rounds
        config["max_risk_discuss_rounds"] = job.max_risk_discuss_rounds

        # Apply LLM provider settings
        provider_defaults = AnalysisService._PROVIDER_DEFAULTS.get(job.llm_provider, {})
        config.update(provider_defaults)

        graph = TradingAgentsGraph(
            selected_analysts=[a.value for a in job.analysts],
            config=config,
        )

        # Use graph.stream() instead of graph.propagate() to get
        # intermediate states for progress tracking
        init_state = graph.propagator.create_initial_state(job.ticker, job.date)
        args = graph.propagator.get_graph_args()

        prev_state = init_state
        final_state = None
        completed_keys: set = set()

        for chunk in graph.graph.stream(init_state, **args):
            final_state = chunk
            _detect_and_apply(job, prev_state, chunk, completed_keys)
            prev_state = chunk

        if final_state is None:
            raise RuntimeError("Graph stream produced no output")

        # Replicate propagate() post-processing
        graph.curr_state = final_state
        graph._log_state(job.date, final_state)
        signal = graph.process_signal(final_state["final_trade_decision"])

        return _extract_result(final_state, signal)


# ── helpers ───────────────────────────────────────────────────────────────────


def _extract_result(state: dict, signal: str) -> AnalysisResult:
    invest = state.get("investment_debate_state", {})
    risk = state.get("risk_debate_state", {})

    return AnalysisResult(
        market_report=state.get("market_report", ""),
        sentiment_report=state.get("sentiment_report", ""),
        news_report=state.get("news_report", ""),
        fundamentals_report=state.get("fundamentals_report", ""),
        investment_debate=InvestDebateResult(
            bull_history=invest.get("bull_history", ""),
            bear_history=invest.get("bear_history", ""),
            history=invest.get("history", ""),
            current_response=invest.get("current_response", ""),
            judge_decision=invest.get("judge_decision", ""),
        ),
        investment_plan=state.get("investment_plan", ""),
        trader_investment_plan=state.get("trader_investment_plan", ""),
        risk_debate=RiskDebateResult(
            risky_history=risk.get("risky_history", ""),
            safe_history=risk.get("safe_history", ""),
            neutral_history=risk.get("neutral_history", ""),
            history=risk.get("history", ""),
            judge_decision=risk.get("judge_decision", ""),
        ),
        final_trade_decision=state.get("final_trade_decision", ""),
        signal=signal.strip().upper(),
    )


# Singleton
analysis_service = AnalysisService()
