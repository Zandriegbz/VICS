import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized errors (expired token, invalid token)
        if (error.status === 401 && token) {
          // Only handle as session expired if we sent a token
          this.handleSessionExpired();
        }
        
        return throwError(() => error);
      })
    );
  }
  
  /**
   * Handle session expired scenario
   */
  private handleSessionExpired(): void {
    // Clear authentication data
    this.authService.logout();
    
    // Show session expired notification
    Swal.fire({
      icon: 'error',
      title: 'Session Expired',
      text: 'Your session has expired. Please log in again.',
      confirmButtonText: 'Ok'
    });
    
    // Redirect to login page
    this.router.navigate(['/login']);
  }
} 