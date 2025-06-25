import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';
import { ChartDataPoint, WeeklyStats, DepartmentVisitor, ChartLegendItem, TimePeriod } from '../models/dashboard.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { api } from '../connection';
import Swal from 'sweetalert2';
import { VicsApiEndpointsService } from './vics-api-endpoints.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  // Mock data for development purposes
  private mockVisitorsTrend: ChartDataPoint[] = [
    { name: 'Mon', value: 85, status: 'up' },
    { name: 'Tue', value: 92, status: 'up' },
    { name: 'Wed', value: 75, status: 'down' },
    { name: 'Thu', value: 110, status: 'peak' },
    { name: 'Fri', value: 92, status: 'down' },
    { name: 'Sat', value: 45, status: 'low' },
    { name: 'Sun', value: 40, status: 'low' }
  ];

  private mockWeeklyStats: WeeklyStats = {
    total: 539,
    average: 77,
    growth: 12.5,
    target: 600,
    achievement: 89.8
  };

  private mockDepartmentVisitors: DepartmentVisitor[] = [
    { name: 'HR Visitors', value: 34, percentage: 28, color: '#7367F0' },
    { name: 'Mayor\'s Office', value: 22, percentage: 18, color: '#00CFE8' },
    { name: 'Others', value: 72, percentage: 54, color: '#28C76F' }
  ];

  private mockChartLegend: ChartLegendItem[] = [
    { label: 'Current', color: '#7367F0', icon: 'circle' },
    { label: 'Previous', color: '#E9ECEF', icon: 'circle' }
  ];

  private mockTimePeriods: TimePeriod[] = [
    { value: '7days', label: '7 Days', active: true },
    { value: '30days', label: '30 Days', active: false },
    { value: '90days', label: 'Quarter', active: false },
    { value: '365days', label: 'Year', active: false }
  ];
  
  // Additional mock data for visitor breakdown
  private mockVisitorBreakdown = {
    total: 128,
    categories: [
      { name: 'HR Visitors', value: 34, color: '#7367F0' },
      { name: 'Mayor\'s Office', value: 22, color: '#00CFE8' },
      { name: 'Others', value: 72, color: '#28C76F' }
    ]
  };
  
  // Mock data for completed meetings
  private mockCompletedMeetings = {
    count: 18,
    change: 'same',
    changeText: 'Same as yesterday'
  };
  
  // Mock data for defaulted visitors
  private mockDefaultedVisitors = {
    count: 5,
    change: 'down',
    percentage: 2,
    changeText: '2% from yesterday'
  };

  constructor(
    private http: HttpClient,
    private apiEndpoints: VicsApiEndpointsService
  ) { }

  getTotalVisitorsTrend(): Observable<ChartDataPoint[]> {
    // Use mock data in development mode
    return of(this.mockVisitorsTrend).pipe(delay(800));
    
    // Uncomment when backend is ready
    /*
    return this.http.get<ChartDataPoint[]>(`${api}${this.apiEndpoints.getTotalVisitorsTrend()}`).pipe(
      catchError(err => this.handleError(err, 'Failed to retrieve visitor trend data'))
    );
    */
  }

  getWeeklyStats(): Observable<WeeklyStats> {
    // Use mock data in development mode
    return of(this.mockWeeklyStats).pipe(delay(600));
    
    // Uncomment when backend is ready
    /*
    return this.http.get<WeeklyStats>(`${api}${this.apiEndpoints.getDashboardStats()}`).pipe(
      catchError(err => this.handleError(err, 'Failed to retrieve weekly stats'))
    );
    */
  }

  getDepartmentVisitors(): Observable<DepartmentVisitor[]> {
    // Use mock data in development mode
    return of(this.mockDepartmentVisitors).pipe(delay(700));
    
    // Uncomment when backend is ready
    /*
    return this.http.get<DepartmentVisitor[]>(`${api}${this.apiEndpoints.getDepartmentVisitors()}`).pipe(
      catchError(err => this.handleError(err, 'Failed to retrieve department visitors data'))
    );
    */
  }

  getChartLegend(): Observable<ChartLegendItem[]> {
    // Use mock data in development mode
    return of(this.mockChartLegend).pipe(delay(500));
    
    // Uncomment when backend is ready
    /*
    return this.http.get<ChartLegendItem[]>(`${api}${this.apiEndpoints.getDashboardStats()}/chart-legend`).pipe(
      catchError(err => this.handleError(err, 'Failed to retrieve chart legend'))
    );
    */
  }

  getTimePeriods(): Observable<TimePeriod[]> {
    // Use mock data in development mode
    return of(this.mockTimePeriods).pipe(delay(500));
    
    // Uncomment when backend is ready
    /*
    return this.http.get<TimePeriod[]>(`${api}${this.apiEndpoints.getDashboardStats()}/time-periods`).pipe(
      catchError(err => this.handleError(err, 'Failed to retrieve time periods'))
    );
    */
  }

  // Helper method to get the previous week total (for comparison)
  getPreviousWeekTotal(): Observable<number> {
    // Use mock data in development mode
    return of(480).pipe(delay(600));
    
    // Uncomment when backend is ready
    /*
    return this.http.get<{ total: number }>(`${api}${this.apiEndpoints.getDashboardStats()}/previous-week`).pipe(
      catchError(err => this.handleError(err, 'Failed to retrieve previous week total')),
      // Extract the total property from the response
      map(response => response.total)
    );
    */
  }
  
  // Get visitor breakdown data
  getVisitorBreakdown(): Observable<any> {
    // Use mock data in development mode
    return of(this.mockVisitorBreakdown).pipe(delay(700));
    
    // Uncomment when backend is ready
    /*
    return this.http.get<any>(`${api}${this.apiEndpoints.getDashboardStats()}/visitor-breakdown`).pipe(
      catchError(err => this.handleError(err, 'Failed to retrieve visitor breakdown'))
    );
    */
  }
  
  // Get completed meetings data
  getCompletedMeetings(): Observable<any> {
    // Use mock data in development mode
    return of(this.mockCompletedMeetings).pipe(delay(600));
    
    // Uncomment when backend is ready
    /*
    return this.http.get<any>(`${api}${this.apiEndpoints.getDashboardStats()}/completed-meetings`).pipe(
      catchError(err => this.handleError(err, 'Failed to retrieve completed meetings data'))
    );
    */
  }
  
  // Get defaulted visitors data
  getDefaultedVisitors(): Observable<any> {
    // Use mock data in development mode
    return of(this.mockDefaultedVisitors).pipe(delay(600));
    
    // Uncomment when backend is ready
    /*
    return this.http.get<any>(`${api}${this.apiEndpoints.getDashboardStats()}/defaulted-visitors`).pipe(
      catchError(err => this.handleError(err, 'Failed to retrieve defaulted visitors data'))
    );
    */
  }

  private handleError(error: HttpErrorResponse, message: string): Observable<never> {
    console.error(error);
    
    // Show SweetAlert2 notification
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `${message}: ${error.error?.message || error.message || 'Unknown error occurred'}`,
      confirmButtonText: 'Ok'
    });
    
    return throwError(() => new Error(message));
  }
} 