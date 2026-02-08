
export interface SummaryResult {
  summary: string;
  keyInsights: string[];
  dataInterpretation: string;
  watchOuts: {
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[];
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface StockPrediction {
  symbol: string;
  currentTrend: 'bullish' | 'bearish' | 'neutral';
  priceTarget: string;
  rationale: string;
  catalysts: string[];
  risks: string[];
  sources: GroundingSource[];
}

export interface AppState {
  isAnalyzing: boolean;
  result: SummaryResult | null;
  stockResult: StockPrediction | null;
  error: string | null;
  fileName: string | null;
  activeMode: 'doc' | 'stock';
}
