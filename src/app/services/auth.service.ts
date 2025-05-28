import { Injectable } from '@angular/core';
import { Observable, of, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { User, LoginResponse, PasswordResetResponse } from '../models/user.model';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private currentUser: User | null = null;
  
  // Mock users for demonstration
  private mockUsers = [
    {
      id: 1,
      username: 'admin',
      password: '123456',
      email: 'admin@example.com',
      role: 'admin'
    },
    {
      id: 2,
      username: 'user',
      password: 'user123',
      email: 'user@example.com',
      role: 'user'
    }
  ];

  constructor(
    private router: Router,
    private errorService: ErrorService
  ) {
    // Check if user is already logged in from localStorage
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
        this.isAuthenticated = true;
      }
    } catch (error) {
      this.errorService.showError('Failed to load user session', error instanceof Error ? error.message : String(error));
      localStorage.removeItem('currentUser');
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    try {
      const user = this.mockUsers.find(u => u.username === username && u.password === password);
      
      if (user) {
        // Create a user object without the password
        const authUser: User = {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        };
        
        // Store user in local storage
        this.currentUser = authUser;
        this.isAuthenticated = true;
        localStorage.setItem('currentUser', JSON.stringify(authUser));
        
        return of({
          success: true,
          message: 'Login successful',
          user: authUser
        });
      } else {
        return of({
          success: false,
          message: 'Invalid username or password'
        });
      }
    } catch (error) {
      this.errorService.showError('Login error', error instanceof Error ? error.message : String(error));
      return of({
        success: false,
        message: 'An unexpected error occurred during login'
      });
    }
  }

  logout(): void {
    try {
      this.isAuthenticated = false;
      this.currentUser = null;
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
    } catch (error) {
      this.errorService.showError('Logout error', error instanceof Error ? error.message : String(error));
    }
  }

  resetPassword(email: string): Observable<PasswordResetResponse> {
    try {
      const user = this.mockUsers.find(u => u.email === email);
      
      if (user) {
        this.errorService.showInfo('Password reset initiated', `Reset instructions sent to ${email}`);
        return of({
          success: true,
          message: 'Password reset instructions have been sent to your email'
        });
      } else {
        this.errorService.showWarning('Password reset failed', `Email not found: ${email}`);
        return of({
          success: false,
          message: 'Email not found'
        });
      }
    } catch (error) {
      this.errorService.showError('Password reset error', error instanceof Error ? error.message : String(error));
      return of({
        success: false,
        message: 'An unexpected error occurred'
      });
    }
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
} 