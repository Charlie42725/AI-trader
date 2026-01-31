import { AnalysisJob, JobSummary, AnalysisRequest } from "./types";

// Mock 資料庫
let mockJobs: AnalysisJob[] = [
  {
    id: "mock-1",
    ticker: "NVDA",
    date: "2024-01-15",
    analysts: ["market", "social", "news", "fundamentals"],
    status: "completed",
    max_debate_rounds: 2,
    max_risk_discuss_rounds: 2,
    created_at: "2024-01-15T10:00:00Z",
    completed_at: "2024-01-15T10:05:00Z",
    error: null,
    result: {
      signal: "BUY",
      market_report: "## 市場技術分析\n\nNVDA 目前處於強勁的上升趨勢中。\n\n- **RSI**: 65（健康區間）\n- **MACD**: 黃金交叉形成\n- **支撐位**: $450\n- **阻力位**: $520\n\n技術面顯示強勁的買入訊號。",
      sentiment_report: "## 社群情緒分析\n\n社交媒體情緒極度看漲。\n\n- Twitter 正面情緒: 78%\n- Reddit 討論熱度: 極高\n- 機構投資者情緒: 樂觀\n\nAI 晶片需求持續推動市場熱情。",
      news_report: "## 新聞分析\n\n近期重大新聞：\n\n1. **AI 資料中心需求激增** - 各大科技公司加大 AI 投資\n2. **新晶片發布** - Blackwell 架構獲得好評\n3. **財報超預期** - 營收增長 122%",
      fundamentals_report: "## 基本面分析\n\n| 指標 | 數值 | 評價 |\n|------|------|------|\n| P/E | 65x | 偏高 |\n| 營收增長 | 122% | 極佳 |\n| 毛利率 | 74% | 優秀 |\n| 自由現金流 | $150億 | 強勁 |",
      investment_debate: {
        bull_history: "## 多頭觀點\n\n1. AI 革命才剛開始，NVDA 是最大受益者\n2. 護城河極深，競爭對手難以追趕\n3. 資料中心業務持續爆發增長",
        bear_history: "## 空頭觀點\n\n1. 估值過高，P/E 達 65 倍\n2. AMD 和自研晶片帶來競爭壓力\n3. AI 泡沫風險",
        history: "",
        current_response: "",
        judge_decision: "## 研究主管決策\n\n綜合多空觀點，**建議買入**。\n\n雖然估值偏高，但 AI 趨勢的確定性和 NVDA 的領導地位支撐了溢價。",
      },
      investment_plan: "## 投資計畫\n\n- **建議動作**: 買入\n- **目標價**: $550\n- **止損價**: $420\n- **倉位**: 投資組合的 5%",
      trader_investment_plan: "## 交易員執行計畫\n\n1. 分批建倉，先買入 50%\n2. 若回調至 $460，加倉剩餘 50%\n3. 設置追蹤止損 15%",
      risk_debate: {
        risky_history: "## 激進派觀點\n\n全倉買入！AI 是百年一遇的機會，不要錯過。",
        safe_history: "## 保守派觀點\n\n建議只配置 2-3%，估值風險太高。",
        neutral_history: "## 中立派觀點\n\n5% 配置合理，設好止損即可。",
        history: "",
        judge_decision: "## 風險經理決策\n\n採納中立派建議，配置 5%，嚴格止損。",
      },
      final_trade_decision: "## 最終交易決策\n\n### 結論：買入 NVDA\n\n| 項目 | 內容 |\n|------|------|\n| 訊號 | **買入** |\n| 目標價 | $550 |\n| 止損價 | $420 |\n| 倉位 | 5% |\n| 信心度 | 85% |\n\n**理由摘要**：AI 趨勢確定，龍頭地位穩固，技術面支持。",
    },
    progress: null,
  },
  {
    id: "mock-2",
    ticker: "AAPL",
    date: "2024-01-14",
    analysts: ["market", "fundamentals"],
    status: "completed",
    max_debate_rounds: 2,
    max_risk_discuss_rounds: 2,
    created_at: "2024-01-14T09:00:00Z",
    completed_at: "2024-01-14T09:03:00Z",
    error: null,
    result: {
      signal: "HOLD",
      market_report: "## 市場分析\n\nAAPL 處於盤整階段，缺乏明確方向。",
      sentiment_report: "",
      news_report: "",
      fundamentals_report: "## 基本面\n\n穩健的現金流和股息，但增長放緩。",
      investment_debate: {
        bull_history: "穩定的現金牛，適合長期持有。",
        bear_history: "創新不足，iPhone 銷售放緩。",
        history: "",
        current_response: "",
        judge_decision: "維持持有，等待更好的入場點。",
      },
      investment_plan: "維持現有倉位，不加不減。",
      trader_investment_plan: "暫不操作。",
      risk_debate: {
        risky_history: "可以小幅加倉。",
        safe_history: "不建議增加倉位。",
        neutral_history: "維持現狀。",
        history: "",
        judge_decision: "同意維持現狀。",
      },
      final_trade_decision: "## 最終決策\n\n**持有**：等待更明確的訊號。",
    },
    progress: null,
  },
  {
    id: "mock-3",
    ticker: "TSLA",
    date: "2024-01-13",
    analysts: ["market", "social", "news"],
    status: "running",
    max_debate_rounds: 2,
    max_risk_discuss_rounds: 2,
    created_at: "2024-01-13T14:00:00Z",
    completed_at: null,
    error: null,
    result: null,
    progress: [
      { key: "market_analyst", label: "市場分析師", status: "done", content: "## 市場分析\n\nTSLA 技術面分析完成。" },
      { key: "social_analyst", label: "社群情緒分析師", status: "running", content: null },
      { key: "news_analyst", label: "新聞分析師", status: "pending", content: null },
      { key: "invest_debate", label: "多空辯論", status: "pending", content: null },
      { key: "research_manager", label: "研究主管決策", status: "pending", content: null },
      { key: "trader", label: "交易員決策", status: "pending", content: null },
      { key: "risk_debate", label: "風險辯論", status: "pending", content: null },
      { key: "final_decision", label: "最終決策", status: "pending", content: null },
    ],
  },
  {
    id: "mock-4",
    ticker: "META",
    date: "2024-01-12",
    analysts: ["market", "social"],
    status: "pending",
    max_debate_rounds: 2,
    max_risk_discuss_rounds: 2,
    created_at: "2024-01-12T16:00:00Z",
    completed_at: null,
    error: null,
    result: null,
    progress: null,
  },
];

let jobIdCounter = 5;

// 模擬延遲
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API 函數
export const mockApi = {
  async listAnalyses(): Promise<JobSummary[]> {
    await delay(300);
    return mockJobs.map((job) => ({
      id: job.id,
      ticker: job.ticker,
      date: job.date,
      analysts: job.analysts,
      status: job.status,
      signal: job.result?.signal ?? null,
      error: job.error,
      created_at: job.created_at,
      completed_at: job.completed_at,
    }));
  },

  async getAnalysis(id: string): Promise<AnalysisJob> {
    await delay(200);
    const job = mockJobs.find((j) => j.id === id);
    if (!job) {
      throw new Error("找不到此分析任務");
    }

    // 模擬進度：running 的任務有機會變成 completed
    if (job.status === "running" && Math.random() > 0.7) {
      job.status = "completed";
      job.completed_at = new Date().toISOString();
      job.result = {
        signal: Math.random() > 0.5 ? "BUY" : "SELL",
        market_report: "## 市場分析報告\n\n自動生成的分析內容...",
        sentiment_report: "## 情緒分析\n\n社群情緒分析完成。",
        news_report: "## 新聞摘要\n\n相關新聞已整理。",
        fundamentals_report: "## 基本面\n\n財務數據分析完成。",
        investment_debate: {
          bull_history: "多頭論點...",
          bear_history: "空頭論點...",
          history: "",
          current_response: "",
          judge_decision: "研究決策...",
        },
        investment_plan: "投資計畫已生成。",
        trader_investment_plan: "交易計畫已生成。",
        risk_debate: {
          risky_history: "激進觀點...",
          safe_history: "保守觀點...",
          neutral_history: "中立觀點...",
          history: "",
          judge_decision: "風險決策...",
        },
        final_trade_decision: "## 最終決策\n\n分析完成，建議操作已生成。",
      };
    }

    // pending 的任務有機會變成 running
    if (job.status === "pending" && Math.random() > 0.5) {
      job.status = "running";
    }

    return job;
  },

  async startAnalysis(request: AnalysisRequest): Promise<{ id: string }> {
    await delay(500);
    const newJob: AnalysisJob = {
      id: `mock-${jobIdCounter++}`,
      ticker: request.ticker,
      date: request.date,
      analysts: request.analysts,
      status: "pending",
      max_debate_rounds: request.max_debate_rounds,
      max_risk_discuss_rounds: request.max_risk_discuss_rounds,
      created_at: new Date().toISOString(),
      completed_at: null,
      error: null,
      result: null,
      progress: null,
    };
    mockJobs.unshift(newJob);
    return { id: newJob.id };
  },
};

// 是否使用 Mock 模式
export const USE_MOCK = true;
