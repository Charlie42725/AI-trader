export type AnalystType = "market" | "social" | "news" | "fundamentals";

export type JobStatus = "pending" | "running" | "completed" | "failed";

export type StepStatus = "pending" | "running" | "done";

export interface ProgressStep {
  key: string;
  label: string;
  status: StepStatus;
  content: string | null;
}

export interface AnalysisRequest {
  ticker: string;
  date: string;
  analysts: AnalystType[];
  max_debate_rounds: number;
  max_risk_discuss_rounds: number;
}

export interface InvestDebateResult {
  bull_history: string;
  bear_history: string;
  history: string;
  current_response: string;
  judge_decision: string;
}

export interface RiskDebateResult {
  risky_history: string;
  safe_history: string;
  neutral_history: string;
  history: string;
  judge_decision: string;
}

export interface AnalysisResult {
  market_report: string;
  sentiment_report: string;
  news_report: string;
  fundamentals_report: string;
  investment_debate: InvestDebateResult;
  investment_plan: string;
  trader_investment_plan: string;
  risk_debate: RiskDebateResult;
  final_trade_decision: string;
  signal: string;
}

export interface AnalysisJob {
  id: string;
  status: JobStatus;
  ticker: string;
  date: string;
  analysts: AnalystType[];
  max_debate_rounds: number;
  max_risk_discuss_rounds: number;
  created_at: string;
  completed_at: string | null;
  result: AnalysisResult | null;
  error: string | null;
  progress: ProgressStep[] | null;
}

export interface JobSummary {
  id: string;
  status: JobStatus;
  ticker: string;
  date: string;
  analysts: AnalystType[];
  signal: string | null;
  created_at: string;
  completed_at: string | null;
  error: string | null;
}
