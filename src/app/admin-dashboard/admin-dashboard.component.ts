import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { ChartDataPoint, WeeklyStats, DepartmentVisitor, ChartLegendItem, TimePeriod } from '../models/dashboard.model';
import { SpinnerService } from '../services/spinner.service';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.css'],
    standalone: false
})
export class AdminDashboardComponent implements OnInit {
  // Data from service
  totalVisitorsTrendData: ChartDataPoint[] = [];
  weeklyStats!: WeeklyStats;
  departmentVisitorsData: DepartmentVisitor[] = [];
  chartLegend: ChartLegendItem[] = [];
  timePeriods: TimePeriod[] = [];

  // Previous week comparison
  previousWeekTotal = 0;
  weeklyGrowth = 0;

  // Chart view dimensions
  chartView: [number, number] = [700, 300];
  donutChartView: [number, number] = [350, 250];

  // Chart color schemes
  colorScheme = {
    domain: ['#7367F0', '#00CFE8', '#28C76F', '#FF9F43', '#EA5455', '#82868B']
  };

  // Chart options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Days';
  yAxisLabel = 'Visitors';
  timeline = true;

  // Current stats
  currentVisitors = 128;
  percentageChange = '+12%';
  comparisonText = 'from yesterday';

  // Time period selection
  selectedPeriod = '7days';
  
  // Data objects
  visitorBreakdown: any = null;
  completedMeetings: any = null;
  defaultedVisitors: any = null;

  constructor(
    private dashboardService: DashboardService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Show spinner for data loading
    if (!this.spinnerService.isCurrentlyNavigating()) {
      this.spinnerService.show();
    }
    
    // Create an array of all the observables we need to fetch
    const requests = [
      this.dashboardService.getTotalVisitorsTrend(),
      this.dashboardService.getWeeklyStats(),
      this.dashboardService.getDepartmentVisitors(),
      this.dashboardService.getChartLegend(),
      this.dashboardService.getTimePeriods(),
      this.dashboardService.getPreviousWeekTotal(),
      this.dashboardService.getVisitorBreakdown(),
      this.dashboardService.getCompletedMeetings(),
      this.dashboardService.getDefaultedVisitors()
    ];
    
    // Use forkJoin to execute all requests in parallel
    forkJoin(requests)
      .pipe(
        finalize(() => {
          if (!this.spinnerService.isCurrentlyNavigating()) {
            this.spinnerService.hide();
          }
        })
      )
      .subscribe({
        next: ([
          trendData,
          weeklyStats,
          departmentVisitors,
          chartLegend,
          timePeriods,
          previousWeekTotal,
          visitorBreakdown,
          completedMeetings,
          defaultedVisitors
        ]) => {
          // Assign the data to component properties
          this.totalVisitorsTrendData = trendData;
          this.weeklyStats = weeklyStats;
          this.departmentVisitorsData = departmentVisitors;
          this.chartLegend = chartLegend;
          this.timePeriods = timePeriods;
          this.previousWeekTotal = previousWeekTotal;
          this.visitorBreakdown = visitorBreakdown;
          this.completedMeetings = completedMeetings;
          this.defaultedVisitors = defaultedVisitors;
          
          // Calculate weekly growth percentage
          this.weeklyGrowth = ((this.weeklyStats.total - this.previousWeekTotal) / this.previousWeekTotal * 100);
        },
        error: (error) => {
          console.error('Error loading dashboard data:', error);
        }
      });
  }

  // Update time period selection and reload data
  onPeriodChange(period: string): void {
    this.selectedPeriod = period;
    this.timePeriods.forEach(p => p.active = p.value === period);
    
    if (!this.spinnerService.isCurrentlyNavigating()) {
      this.spinnerService.show();
    }
    
    // Simulate data refresh (would be replaced with actual API call)
    setTimeout(() => {
      if (!this.spinnerService.isCurrentlyNavigating()) {
        this.spinnerService.hide();
      }
    }, 1000);
  }

  onBarClick(day: ChartDataPoint): void {
    console.log('Clicked on day:', day);
    // Navigation for detailed view would be implemented here
  }

  exportChart(): void {
    console.log('Exporting chart...');
    // Export functionality would be implemented here
  }
}
