import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service'; // Import service
import { ChartDataPoint, WeeklyStats, DepartmentVisitor, ChartLegendItem, TimePeriod } from '../models/dashboard.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
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

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Fetch all data from the service
    this.dashboardService.getTotalVisitorsTrend().subscribe(data => {
      this.totalVisitorsTrendData = data;
    });

    this.dashboardService.getWeeklyStats().subscribe(data => {
      this.weeklyStats = data;
    });

    this.dashboardService.getDepartmentVisitors().subscribe(data => {
      this.departmentVisitorsData = data;
    });

    this.dashboardService.getChartLegend().subscribe(data => {
      this.chartLegend = data;
    });

    this.dashboardService.getTimePeriods().subscribe(data => {
      this.timePeriods = data;
    });

    this.dashboardService.getPreviousWeekTotal().subscribe(total => {
      this.previousWeekTotal = total;
      // Calculate weekly growth percentage after getting both current and previous week totals
      this.dashboardService.getWeeklyStats().subscribe(stats => {
        this.weeklyGrowth = ((stats.total - this.previousWeekTotal) / this.previousWeekTotal * 100);
      });
    });
  }

  // Methods for interactivity
  onPeriodChange(period: string) {
    this.selectedPeriod = period;
    this.timePeriods.forEach(p => p.active = p.value === period);
    // Here you would typically fetch new data based on the selected period
    console.log('Period changed to:', period);
  }

  onBarClick(day: ChartDataPoint) {
    console.log('Clicked on day:', day);
    // Here you would navigate to detailed view for that day
  }

  exportChart() {
    console.log('Exporting chart...');
    // Here you would implement chart export functionality
  }
}
