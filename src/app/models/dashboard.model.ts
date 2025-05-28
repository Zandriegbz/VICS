// src/app/models/dashboard.model.ts
export interface ChartDataPoint {
  name: string;
  value: number;
  change?: number;
  status?: 'up' | 'down' | 'peak' | 'low' | 'current' | string;
}

export interface WeeklyStats {
  total: number;
  average: number;
  growth: number;
  target: number;
  achievement: number;
}

export interface DepartmentVisitor {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface ChartLegendItem {
  label: string;
  color: string;
  icon: string;
}

export interface TimePeriod {
  value: string;
  label: string;
  active: boolean;
} 