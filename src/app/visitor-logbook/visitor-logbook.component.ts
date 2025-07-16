import { Component, OnInit, OnDestroy } from '@angular/core';
import { VisitorService } from '../services/visitor.service';
import { Visitor } from '../models/visitor.model';
import { SpinnerService } from '../services/spinner.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject, interval } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-visitor-logbook',
    templateUrl: './visitor-logbook.component.html',
    styleUrls: ['./visitor-logbook.component.css'],
    standalone: false
})
export class VisitorLogbookComponent implements OnInit, OnDestroy {
  // Filter properties
  searchTerm: string = '';
  selectedDate: string = '';
  selectedCertificateFilter: string = 'all';
  
  // Data arrays
  allVisitors: Visitor[] = [];
  filteredVisitors: Visitor[] = [];
  paginatedVisitors: Visitor[] = [];
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  customPageInput: string = '';
  
  // Auto-refresh properties
  private destroy$ = new Subject<void>();
  private autoRefreshInterval = 3 * 60 * 1000; // 3 minutes
  lastRefreshTime: Date = new Date();
  nextRefreshTime: Date = new Date();
  
  // Expose Math to template
  Math = Math;

  constructor(
    private visitorService: VisitorService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.loadVisitorData();
    this.setupAutoRefresh();
  }

  ngOnDestroy(): void {
    // Close all visitors when leaving the page
    this.allVisitors.forEach(visitor => visitor.open = false);
    
    // Clean up auto-refresh subscription
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Set up auto-refresh functionality with 3-minute intervals
   */
  private setupAutoRefresh(): void {
    // Update next refresh time
    this.updateNextRefreshTime();
    
    // Set up interval for auto-refresh
    interval(this.autoRefreshInterval)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.autoRefreshData();
      });
  }

  /**
   * Auto-refresh data without showing full loading spinner
   */
  private autoRefreshData(): void {
    console.log('Auto-refreshing visitor data...');
    
    this.visitorService.getVisitors()
      .pipe(
        finalize(() => {
          this.lastRefreshTime = new Date();
          this.updateNextRefreshTime();
        })
      )
      .subscribe({
        next: (data) => {
          const previousCount = this.allVisitors.length;
          
          // Sort visitors by latest first
          this.allVisitors = this.sortVisitorsByLatest(data);
          
          // Auto-open the latest visitor only if new visitors were added
          const newCount = this.allVisitors.length;
          if (newCount > previousCount) {
            this.autoOpenLatestVisitor();
            const newVisitorsCount = newCount - previousCount;
            this.showAutoRefreshNotification(newVisitorsCount);
          }
          
          this.applyFilters();
        },
        error: (error) => {
          console.error('Auto-refresh failed:', error);
          // Don't show error popup for auto-refresh failures to avoid interrupting user
        }
      });
  }

  /**
   * Show subtle notification for auto-refresh updates
   */
  private showAutoRefreshNotification(newVisitorsCount: number): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });

    Toast.fire({
      icon: 'info',
      title: `${newVisitorsCount} new visitor${newVisitorsCount > 1 ? 's' : ''} detected!`
    });
  }

  /**
   * Update next refresh time calculation
   */
  private updateNextRefreshTime(): void {
    this.nextRefreshTime = new Date(Date.now() + this.autoRefreshInterval);
  }



  /**
   * Manual refresh with user feedback
   */
  manualRefresh(): void {
    if (!this.spinnerService.isCurrentlyNavigating()) {
      this.spinnerService.show();
    }
    
    this.visitorService.getVisitors()
      .pipe(
        finalize(() => {
          if (!this.spinnerService.isCurrentlyNavigating()) {
            this.spinnerService.hide();
          }
          this.lastRefreshTime = new Date();
          this.updateNextRefreshTime();
        })
      )
      .subscribe({
        next: (data) => {
          this.allVisitors = data;
          this.applyFilters();
          
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Data refreshed successfully',
            showConfirmButton: false,
            timer: 1500
          });
        },
        error: (error) => {
          console.error('Manual refresh failed:', error);
        }
      });
  }

  /**
   * Get time until next auto-refresh in minutes
   */
  getTimeUntilNextRefresh(): number {
    const diffMs = this.nextRefreshTime.getTime() - Date.now();
    return Math.max(0, Math.ceil(diffMs / (60 * 1000))); // Convert to minutes
  }
  
  loadVisitorData(): void {
    if (!this.spinnerService.isCurrentlyNavigating()) {
      this.spinnerService.show();
    }
    
    this.visitorService.getVisitors()
      .pipe(
        finalize(() => {
          if (!this.spinnerService.isCurrentlyNavigating()) {
            this.spinnerService.hide();
          }
          this.lastRefreshTime = new Date();
          this.updateNextRefreshTime();
        })
      )
      .subscribe({
        next: (data) => {
          // Sort visitors by latest first (date + time)
          this.allVisitors = this.sortVisitorsByLatest(data);
          
          // Auto-open the first (latest) visitor card
          this.autoOpenLatestVisitor();
          
          this.applyFilters();
        },
        error: (error) => {
          console.error('Error loading visitor data:', error);
        }
      });
  }

  /**
   * Sort visitors by latest date and time first
   */
  private sortVisitorsByLatest(visitors: Visitor[]): Visitor[] {
    return visitors.sort((a, b) => {
      // Combine date and time for accurate sorting
      const dateTimeA = new Date(`${a.date} ${a.time}`);
      const dateTimeB = new Date(`${b.date} ${b.time}`);
      
      // Sort in descending order (latest first)
      return dateTimeB.getTime() - dateTimeA.getTime();
    });
  }

  /**
   * Auto-open the first (latest) visitor card
   */
  private autoOpenLatestVisitor(): void {
    // Close all visitors first
    this.allVisitors.forEach(visitor => visitor.open = false);
    
    // Open the first visitor (latest) if exists
    if (this.allVisitors.length > 0) {
      this.allVisitors[0].open = true;
    }
  }

  toggleVisitor(index: number): void {
    // Find the original visitor in the main array using the paginated visitor
    const paginatedVisitor = this.paginatedVisitors[index];
    const originalIndex = this.allVisitors.findIndex(v => 
      v.clientId === paginatedVisitor.clientId && 
      v.date === paginatedVisitor.date && 
      v.time === paginatedVisitor.time
    );
    
    if (originalIndex !== -1) {
      this.allVisitors[originalIndex].open = !this.allVisitors[originalIndex].open;
      this.updatePagination();
    }
  }

  applyFilters(): void {
    if (!this.spinnerService.isCurrentlyNavigating()) {
      this.spinnerService.show();
    }
    
    // Use setTimeout for better UX
    setTimeout(() => {
      this.filteredVisitors = this.allVisitors.filter(visitor => {
        // Search filter
        const matchesSearch = this.searchTerm === '' || 
          `${visitor.Firstname} ${visitor.Lastname}`.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          visitor.clientId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          visitor.Agency.toLowerCase().includes(this.searchTerm.toLowerCase());

        // Date filter
        const matchesDate = this.selectedDate === '' || visitor.date === this.selectedDate;

        // Certificate filter
        let matchesCertificate = true;
        if (this.selectedCertificateFilter === 'certificate') {
          matchesCertificate = visitor.status === 'Printed';
        } else if (this.selectedCertificateFilter === 'no-certificate') {
          matchesCertificate = visitor.status === 'Not Printed';
        }

        return matchesSearch && matchesDate && matchesCertificate;
      });
      
      // Reset to first page when filters change
      this.currentPage = 1;
      this.updatePagination();
      
      if (!this.spinnerService.isCurrentlyNavigating()) {
        this.spinnerService.hide();
      }
    }, 300);
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredVisitors.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedVisitors = this.filteredVisitors.slice(startIndex, endIndex);
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onDateChange(): void {
    this.applyFilters();
  }

  onCertificateFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedDate = '';
    this.selectedCertificateFilter = 'all';
    this.applyFilters();
  }

  printAll(): void {
    if (!this.spinnerService.isCurrentlyNavigating()) {
      this.spinnerService.show();
    }
    
    // Simulate print processing
    setTimeout(() => {
      console.log('Printing all filtered visitors:', this.filteredVisitors);
      
      if (!this.spinnerService.isCurrentlyNavigating()) {
        this.spinnerService.hide();
      }
    }, 1500);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      if (!this.spinnerService.isCurrentlyNavigating()) {
        this.spinnerService.show();
      }
      
      setTimeout(() => {
        this.currentPage = page;
        this.updatePagination();
        
        if (!this.spinnerService.isCurrentlyNavigating()) {
          this.spinnerService.hide();
        }
      }, 300);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  onCustomPageInput(): void {
    const pageNumber = parseInt(this.customPageInput);
    if (!isNaN(pageNumber)) {
      this.goToPage(pageNumber);
      this.customPageInput = '';
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    if (this.totalPages <= maxPagesToShow) {
      // If total pages is less than max pages to show, show all pages
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate range to show around current page
      let start = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
      let end = start + maxPagesToShow - 1;
      
      // Adjust if end exceeds total pages
      if (end > this.totalPages) {
        end = this.totalPages;
        start = Math.max(1, end - maxPagesToShow + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }
}
