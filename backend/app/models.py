from __future__ import annotations

import enum
from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class AnalystType(str, enum.Enum):
    market = "market"
    social = "social"
    news = "news"
    fundamentals = "fundamentals"


class JobStatus(str, enum.Enum):
    pending = "pending"
    running = "running"
    completed = "completed"
    failed = "failed"


class StepStatus(str, enum.Enum):
    pending = "pending"
    running = "running"
    done = "done"


class ProgressStep(BaseModel):
    key: str
    label: str
    status: StepStatus = StepStatus.pending
    content: Optional[str] = None  # 該步驟產出的內容（報告、辯論等）


# ── Request ──────────────────────────────────────────────────────────────────

class AnalysisRequest(BaseModel):
    ticker: str
    date: str  # YYYY-MM-DD
    analysts: list[AnalystType] = [
        AnalystType.market,
        AnalystType.social,
        AnalystType.news,
        AnalystType.fundamentals,
    ]
    max_debate_rounds: int = 1
    max_risk_discuss_rounds: int = 1


# ── Nested result models ─────────────────────────────────────────────────────

class InvestDebateResult(BaseModel):
    bull_history: str = ""
    bear_history: str = ""
    history: str = ""
    current_response: str = ""
    judge_decision: str = ""


class RiskDebateResult(BaseModel):
    risky_history: str = ""
    safe_history: str = ""
    neutral_history: str = ""
    history: str = ""
    judge_decision: str = ""


class AnalysisResult(BaseModel):
    market_report: str = ""
    sentiment_report: str = ""
    news_report: str = ""
    fundamentals_report: str = ""
    investment_debate: InvestDebateResult = InvestDebateResult()
    investment_plan: str = ""
    trader_investment_plan: str = ""
    risk_debate: RiskDebateResult = RiskDebateResult()
    final_trade_decision: str = ""
    signal: str = ""  # BUY / SELL / HOLD


# ── Job (stored in-memory) ───────────────────────────────────────────────────

class AnalysisJob(BaseModel):
    id: str
    status: JobStatus = JobStatus.pending
    ticker: str
    date: str
    analysts: list[AnalystType]
    max_debate_rounds: int = 1
    max_risk_discuss_rounds: int = 1
    created_at: datetime
    completed_at: Optional[datetime] = None
    result: Optional[AnalysisResult] = None
    error: Optional[str] = None
    progress: Optional[list[ProgressStep]] = None


# ── Response summaries ───────────────────────────────────────────────────────

class JobSummary(BaseModel):
    id: str
    status: JobStatus
    ticker: str
    date: str
    analysts: list[AnalystType]
    signal: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    error: Optional[str] = None
