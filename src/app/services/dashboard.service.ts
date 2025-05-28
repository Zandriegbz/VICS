import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ChartDataPoint, WeeklyStats, DepartmentVisitor, ChartLegendItem, TimePeriod } from '../models/dashboard.model';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private mockTotalVisitorsTrendData: ChartDataPoint[] = [
    { name: "Mon", value: 110, change: -5.2, status: 'down' },
    { name: "Tue", value: 115, change: +4.5, status: 'up' },
    { name: "Wed", value: 130, change: +13.0, status: 'up' },
    { name: "Thu", value: 120, change: -7.7, status: 'down' },
    { name: "Fri", value: 140, change: +16.7, status: 'peak' },
    { name: "Sat", value: 90, change: -35.7, status: 'low' },
    { name: "Today", value: 128, change: +42.2, status: 'current' }
  ];

  private mockWeeklyStats: WeeklyStats = {
    total: 833,
    average: 119,
    growth: +12.5,
    target: 850,
    achievement: 98.0
  };

  private mockDepartmentVisitorsData: DepartmentVisitor[] = [
    { name: "HR Visitors", value: 34, percentage: 26.6, color: '#7367F0' },
    { name: "Mayor's Office", value: 22, percentage: 17.2, color: '#00CFE8' },
    { name: "Others", value: 72, percentage: 56.2, color: '#28C76F' }
  ];

  private mockChartLegend: ChartLegendItem[] = [
    { label: 'Daily Visitors', color: '#7367F0', icon: 'fas fa-users' },
    { label: 'Peak Day', color: '#28C76F', icon: 'fas fa-arrow-up' },
    { label: 'Current Day', color: '#FF9F43', icon: 'fas fa-calendar-day' }
  ];

  private mockTimePeriods: TimePeriod[] = [
    { value: '7days', label: '7 Days', active: true },
    { value: '30days', label: '30 Days', active: false },
    { value: '3months', label: '3 Months', active: false }
  ];

  constructor(private errorService: ErrorService) { }

  getTotalVisitorsTrend(): Observable<ChartDataPoint[]> {
    try {
      return of(JSON.parse(JSON.stringify(this.mockTotalVisitorsTrendData)));
    } catch (error) {
      this.errorService.showError('Failed to retrieve visitor trend data', error instanceof Error ? error.message : String(error));
      return of([]);
    }
  }

  getWeeklyStats(): Observable<WeeklyStats> {
    try {
      return of(JSON.parse(JSON.stringify(this.mockWeeklyStats)));
    } catch (error) {
      this.errorService.showError('Failed to retrieve weekly stats', error instanceof Error ? error.message : String(error));
      return of({
        total: 0,
        average: 0,
        growth: 0,
        target: 0,
        achievement: 0
      });
    }
  }

  getDepartmentVisitors(): Observable<DepartmentVisitor[]> {
    try {
      return of(JSON.parse(JSON.stringify(this.mockDepartmentVisitorsData)));
    } catch (error) {
      this.errorService.showError('Failed to retrieve department visitors data', error instanceof Error ? error.message : String(error));
      return of([]);
    }
  }

  getChartLegend(): Observable<ChartLegendItem[]> {
    try {
      return of(JSON.parse(JSON.stringify(this.mockChartLegend)));
    } catch (error) {
      this.errorService.showError('Failed to retrieve chart legend', error instanceof Error ? error.message : String(error));
      return of([]);
    }
  }

  getTimePeriods(): Observable<TimePeriod[]> {
    try {
      return of(JSON.parse(JSON.stringify(this.mockTimePeriods)));
    } catch (error) {
      this.errorService.showError('Failed to retrieve time periods', error instanceof Error ? error.message : String(error));
      return of([]);
    }
  }

  // Helper method to get the previous week total (for comparison)
  getPreviousWeekTotal(): Observable<number> {
    try {
      return of(742); // Hardcoded value from the component
    } catch (error) {
      this.errorService.showError('Failed to retrieve previous week total', error instanceof Error ? error.message : String(error));
      return of(0);
    }
  }
} 