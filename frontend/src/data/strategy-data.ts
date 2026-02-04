// frontend/src/data/strategy-data.ts

export interface Option {
  id: string;
  label: string;
  desc: string;
  categoryTag?: string; // 增加細分標籤，如 "High Accuracy" 或 "Lagging"
  isPremium?: boolean;  // 預留收費或高級權限接口
}

export interface Category {
  id: string;
  label: string;
  options: Option[];
}

export interface ModuleData {
  id: string;
  label: string; // 增加模組名稱
  placeholder: string;
  categories: Category[];
}

export const STRATEGY_DATABASE: Record<string, ModuleData> = {
  market: {
    id: "market",
    label: "市場分析",
    placeholder: "例如：當 4H 週期 RSI 低於 30 且出現黃金交叉...",
    categories: [
      {
        id: "trend",
        label: "趨勢指標",
        options: [
          { id: "rsi", label: "RSI 強弱指標", desc: "監測超買超賣區間" },
          { id: "macd", label: "MACD 動能", desc: "判斷多空轉換點" },
          { id: "ema_ribbon", label: "EMA 均線帶", desc: "多週期趨勢排列分析" },
          { id: "supertrend", label: "超級趨勢", desc: "自適應趨勢追蹤指標" } // 新增：實戰常用
        ]
      },
      {
        id: "volatility",
        label: "能量波動",
        options: [
          { id: "bollinger", label: "布林通道", desc: "標準差擠壓分析" },
          { id: "atr", label: "ATR 波動率", desc: "評估真實波動範圍" },
          { id: "vwap", label: "成交量加權平均價", desc: "判斷機構進場成本" } // 新增：專業交易者必備
        ]
      },
      {
        id: "liquidity",
        label: "流動性/量價",
        options: [
          { id: "orderbook", label: "訂單簿深度", desc: "分析掛單牆與阻力位" },
          { id: "volume_profile", label: "固定範圍成交量", desc: "尋找籌碼密集區" }
        ]
      }
    ]
  },
  social: {
    id: "social",
    label: "社群情緒",
    placeholder: "例如：監控 X 上關鍵字 #BTC 的討論熱度...",
    categories: [
      {
        id: "platforms",
        label: "即時情報源",
        options: [
          { id: "x", label: "X (Twitter)", desc: "追蹤 KOL 與官方公告" },
          { id: "telegram", label: "Telegram Channels", desc: "監控 Alpha 頻道與洩漏消息" }, // 新增
          { id: "discord", label: "Discord Alpha", desc: "社群核心討論熱度" } // 新增
        ]
      },
      {
        id: "ai_sentiment",
        label: "大數據與大戶",
        options: [
          { id: "feargreed", label: "恐慌貪婪指數", desc: "市場極端情緒預警" },
          { id: "whale_alert", label: "Whale Alert", desc: "鏈上大額資金流向" },
          { id: "liquidations", label: "爆倉數據", desc: "監測空單/多單連環爆倉壓力" } // 新增：非常有參考價值
        ]
      }
    ]
  },
  news: {
    id: "news",
    label: "新聞分析",
    placeholder: "例如：即時監控 Fed 利率決策或灰度持倉變動...",
    categories: [
      {
        id: "macro",
        label: "宏觀數據",
        options: [
          { id: "fed", label: "聯準會動態", desc: "利率決策與 CPI 數據" }, // 細化
          { id: "f10", label: "財經日曆", desc: "全球重要經濟數據發佈時間" }
        ]
      },
      {
        id: "crypto_news",
        label: "幣圈快訊",
        options: [
          { id: "reuters", label: "路透社", desc: "全球政經新聞" },
          { id: "coindesk", label: "CoinDesk / Cointelegraph", desc: "行業權威深度報導" },
          { id: "foresight", label: "Foresight News", desc: "亞洲區即時快訊" }
        ]
      }
    ]
  },
  fundamental: {
    id: "fundamental",
    label: "基本面/鏈上",
    placeholder: "例如：當項目 TVL 增長超過 20% 或穩定幣流入...",
    categories: [
      {
        id: "value",
        label: "協議價值",
        options: [
          { id: "marketcap", label: "市值/估值分析", desc: "MC/FDV 比率分析" },
          { id: "tvl", label: "TVL 鎖倉量", desc: "協議資金沉澱分析" },
          { id: "protocol_revenue", label: "協議營收", desc: "分析實際盈利能力" } // 新增：判斷是否為空氣幣
        ]
      },
      {
        id: "onchain_health",
        label: "鏈上健康度",
        options: [
          { id: "active_addresses", label: "活躍地址數", desc: "用戶增長趨勢" },
          { id: "stablecoin_inflow", label: "穩定幣流入", desc: "潛在購買力指標" }, // 新增：牛市關鍵
          { id: "exchange_reserve", label: "交易所外匯儲備", desc: "評估賣壓強度" } // 新增
        ]
      }
    ]
  }
};

export const DEFAULT_CONFIGS: Record<string, string[]> = {
  market: ["rsi", "macd", "ema_ribbon"],
  social: ["x", "feargreed"],
  news: ["fed", "coindesk"],
  fundamental: ["marketcap", "stablecoin_inflow"],
};