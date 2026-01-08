
export interface VideoAnalysis {
  basicInfo: string;
  summary: string[];
  breakdown: string;
  logic: string;
  titleAnalysis: string;
  viralReasons: string;
  templates: string[];
  rewrites: string[];
  derivatives: string[];
  titleSuggestions: string[];
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
