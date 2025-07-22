import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, LoginResponse, PasswordResetResponse } from '../models/user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Storage keys
  private readonly TOKEN_KEY = 'vics_auth_token';
  private readonly USER_DATA_KEY = 'vics_user_data';

  // Authentication state
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
    this.initializeAuthState();
  }

  /**
   * Initialize authentication state from localStorage
   */
  private initializeAuthState(): void {
    const storedToken = localStorage.getItem(this.TOKEN_KEY);
    const storedUser = localStorage.getItem(this.USER_DATA_KEY);

    if (storedToken && storedUser && this.validateToken(storedToken)) {
      const user: User = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
    } else {
      this.clearAuthData();
    }
  }

  /**
   * Validate token format (simple check)
   */
  private validateToken(token: string): boolean {
    return token.startsWith('mock-jwt-token-') || token.split('.').length === 3;
  }

  /**
   * Login user
   */
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/Auth/login`, { username, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            const authUser: User = {
              eic: response.eic,
              name: response.name,
              username: response.username,
              role: response.role
            };
            this.saveAuthData(authUser, response.token);
          }
        }),
        catchError(this.handleError('Login error'))
      );
  }

  /**
   * Save auth data to localStorage and BehaviorSubject
   */
  private saveAuthData(user: User, token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  /**
   * Clear auth data
   */
  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
    this.currentUserSubject.next(null);
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Is user logged in
   */
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && this.validateToken(token);
  }

  /**
   * Get current user (one-time)
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Reset password (optional)
   */
  resetPassword(email: string): Observable<PasswordResetResponse> {
    return this.http.post<PasswordResetResponse>(
      `${environment.apiUrl}/Auth/reset-password`,
      { email }
    ).pipe(
      catchError(this.handleError('Password reset error'))
    );
  }

  /**
   * Generic error handler
   */
  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      console.error(`${operation}:`, error);
      Swal.fire({
        icon: 'error',
        title: 'Operation Failed',
        text: `${operation}: ${error.error?.message || error.message || 'Unknown error occurred'}`,
        confirmButtonText: 'Ok'
      });
      return throwError(() => error);
    };
  }
}
