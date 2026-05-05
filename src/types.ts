export type Severity = 'critical' | 'warning' | 'normal';

export interface Alert {
  id: string;
  instrumentId: string;
  instrumentName: string;
  severity: 'critical' | 'warning';
  summary: string;
  timestamp: string;
  aiInsight: string;
}

export interface Instrument {
  id: string;
  name: string;
  type: string;
  status: 'operational' | 'warning' | 'critical' | 'idle';
  healthScore: number; // 0-100
  lastCalibrated: string;
  location: string;
  floor: string;
  room: string;
  position?: { x: number; y: number };
  aiInsights: string[];
  predictions: Prediction[];
  anomalies: Anomaly[];
  recommendations: Recommendation[];
  workflow?: string;
  logs: LogEntry[];
}

export interface Prediction {
  id: string;
  target: string;
  probability: number;
  timeframe: string;
  impact: string;
}

export interface Anomaly {
  id: string;
  timestamp: string;
  parameter: string;
  deviation: string;
  context: string;
}

export interface Recommendation {
  id: string;
  action: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SYSTEM';
  message: string;
}
