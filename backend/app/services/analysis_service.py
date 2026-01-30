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
    JobStatus,
    JobSummary,
)


class AnalysisService:
    """In-memory job store and TradingAgentsGraph runner."""

    def __init__(self) -> None:
        self._jobs: Dict[str, AnalysisJob] = {}

    # ── public API ────────────────────────────────────────────────────────

    def create_job(self, req: AnalysisRequest) -> AnalysisJob:
        job = AnalysisJob(
            id=uuid.uuid4().hex[:12],
            status=JobStatus.pending,
            ticker=req.ticker.upper(),
            date=req.date,
            analysts=req.analysts,
            max_debate_rounds=req.max_debate_rounds,
            max_risk_discuss_rounds=req.max_risk_discuss_rounds,
            created_at=datetime.utcnow(),
        )
        self._jobs[job.id] = job
        return job

    def get_job(self, job_id: str) -> AnalysisJob | None:
        return self._jobs.get(job_id)

    def list_jobs(self) -> list[JobSummary]:
        return [
            JobSummary(
                id=j.id,
                status=j.status,
                ticker=j.ticker,
                date=j.date,
                analysts=j.analysts,
                signal=j.result.signal if j.result else None,
                created_at=j.created_at,
                completed_at=j.completed_at,
                error=j.error,
            )
            for j in sorted(
                self._jobs.values(), key=lambda j: j.created_at, reverse=True
            )
        ]

    # ── background runner (called from BackgroundTasks) ───────────────────

    async def run_analysis(self, job_id: str) -> None:
        job = self._jobs.get(job_id)
        if job is None:
            return
        job.status = JobStatus.running

        try:
            result = await asyncio.to_thread(self._run_sync, job)
            job.result = result
            job.status = JobStatus.completed
        except Exception:
            job.error = traceback.format_exc()
            job.status = JobStatus.failed
        finally:
            job.completed_at = datetime.utcnow()

    # ── sync wrapper executed in thread pool ──────────────────────────────

    @staticmethod
    def _run_sync(job: AnalysisJob) -> AnalysisResult:
        config = DEFAULT_CONFIG.copy()
        config["max_debate_rounds"] = job.max_debate_rounds
        config["max_risk_discuss_rounds"] = job.max_risk_discuss_rounds

        graph = TradingAgentsGraph(
            selected_analysts=[a.value for a in job.analysts],
            config=config,
        )

        final_state, signal = graph.propagate(job.ticker, job.date)
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
