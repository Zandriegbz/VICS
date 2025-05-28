import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private requestCount = 0;
  private isNavigating = false;
  
  // Spinner configuration
  private readonly SPINNER_TYPE = 'ball-scale-multiple';

  constructor(
    private spinnerService: NgxSpinnerService,
    private router: Router
  ) {
    this.setupNavigationEvents();
  }
  
  /**
   * Setup router event listeners for spinner management
   */
  private setupNavigationEvents(): void {
    this.router.events
      .pipe(
        filter(event => 
          event instanceof NavigationStart ||
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        )
      )
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          this.handleNavigationStart();
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.handleNavigationEnd();
        }
      });
  }
  
  /**
   * Handle navigation start event
   */
  private handleNavigationStart(): void {
    this.isNavigating = true;
    this.show();
  }
  
  /**
   * Handle navigation end event
   */
  private handleNavigationEnd(): void {
    this.isNavigating = false;
    this.requestCount = 0;
    this.spinnerService.hide();
  }

  /**
   * Show spinner
   */
  show(): void {
    this.requestCount++;
    this.spinnerService.show(undefined, {
      type: this.SPINNER_TYPE,
      bdColor: 'rgba(255, 255, 255, 0.8)',
      color: '#dc3545'
    });
  }

  /**
   * Hide spinner (decrements request count)
   */
  hide(): void {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.spinnerService.hide();
    }
  }
  
  /**
   * Force hide spinner regardless of count
   */
  forceHide(): void {
    this.requestCount = 0;
    this.spinnerService.hide();
  }
  
  /**
   * Check if currently navigating
   */
  isCurrentlyNavigating(): boolean {
    return this.isNavigating;
  }
} 