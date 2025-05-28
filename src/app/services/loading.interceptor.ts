import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, finalize, catchError, throwError } from 'rxjs';
import { SpinnerService } from './spinner.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  // URLs that should not trigger the spinner
  private readonly excludedUrls: string[] = [
    '/notifications'
  ];

  constructor(private spinnerService: SpinnerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip spinner for excluded URLs
    if (this.shouldSkipSpinner(request.url)) {
      return next.handle(request);
    }
    
    // Show spinner if not navigating (avoid duplicate spinners)
    if (!this.spinnerService.isCurrentlyNavigating()) {
      this.spinnerService.show();
    }
    
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Force hide spinner on error to ensure it doesn't get stuck
        this.spinnerService.forceHide();
        return throwError(() => error);
      }),
      finalize(() => {
        // Hide spinner when request completes (if not navigating)
        if (!this.spinnerService.isCurrentlyNavigating()) {
          this.spinnerService.hide();
        }
      })
    );
  }
  
  /**
   * Check if spinner should be skipped for this URL
   */
  private shouldSkipSpinner(url: string): boolean {
    return this.excludedUrls.some(excludedUrl => url.includes(excludedUrl));
  }
} 