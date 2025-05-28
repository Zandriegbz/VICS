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
  constructor(private spinnerService: SpinnerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip spinner for notification requests
    if (request.url.includes('/notifications')) {
      return next.handle(request);
    }
    
    // Show spinner if not navigating
    if (!this.spinnerService.isCurrentlyNavigating()) {
      this.spinnerService.show();
    }
    
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.spinnerService.forceHide();
        return throwError(() => error);
      }),
      finalize(() => {
        if (!this.spinnerService.isCurrentlyNavigating()) {
          this.spinnerService.hide();
        }
      })
    );
  }
} 