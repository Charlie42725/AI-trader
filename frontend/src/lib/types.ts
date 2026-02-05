export type AnalystType = "market" | "social" | "news" | "fundamentals";

export type LLMProvider = "openai" | "google";

export type JobStatus = "pending" | "running" | "completed" | "failed";

export type StepStatus = "pending" | "running" | "done";

// --- 核心配置介面 (已整合重複項) ---
export interface ConfigControl {
  key: string;
  label: string;
  type: "number" | "select" | "boolean" | "text"; // 整合所有需要的型別
  default: any;
  min?: number;
  max?: number;
  // 修正截圖中的型別錯誤，支援多種 options 格式
  options?: any[]; 
}

export interface Option {
  id: string;
  label: string;
  desc: string;
  configSchema?: ConfigControl[];
}

export interface Category {
  id: string;
  label: string;
  options: Option[];
}

export interface StrategyCategory {
  id: string;
  label: string;
  placeholder: string;
  categories: Category[];
}

// --- 分析流程介面 ---
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
  strategy_config?: Record<string, any>; 
  max_debate_rounds: number;
  max_risk_discuss_rounds: number;
  llm_provider: LLMProvider;
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
  llm_provider: LLMProvider;
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
  llm_provider: LLMProvider;
  signal: string | null;
  created_at: string;
  completed_at: string | null;
  error: string | null;
}