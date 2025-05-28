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

  constructor(
    private spinnerService: NgxSpinnerService,
    private router: Router
  ) {
    // Handle router events to automatically show/hide spinner
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
        // Show spinner on navigation start
        if (event instanceof NavigationStart) {
          this.isNavigating = true;
          this.spinnerService.show();
        }
        
        // Hide spinner when navigation ends
        if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.isNavigating = false;
          this.requestCount = 0;
          this.spinnerService.hide();
        }
      });
  }

  // Show spinner
  show(): void {
    this.requestCount++;
    this.spinnerService.show();
  }

  // Hide spinner
  hide(): void {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.spinnerService.hide();
    }
  }
  
  // Force hide spinner regardless of count
  forceHide(): void {
    this.requestCount = 0;
    this.spinnerService.hide();
  }
  
  // Helper method to check if we're currently navigating
  isCurrentlyNavigating(): boolean {
    return this.isNavigating;
  }
} 