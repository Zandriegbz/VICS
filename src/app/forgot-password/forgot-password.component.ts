import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private errorService: ErrorService
  ) {}

  onSubmit() {
    if (!this.email) {
      this.errorService.showWarning('Email Required', 'Please enter your email address.');
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.errorService.showWarning('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    this.isLoading = true;

    this.authService.resetPassword(this.email).subscribe({
      next: (result) => {
        this.isLoading = false;
        if (result.success) {
          this.errorService.showInfo('Password Reset', result.message);
          // Redirect to login after 3 seconds
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        } else {
          this.errorService.showError('Reset Failed', result.message);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorService.showError('Reset Failed', 'An unexpected error occurred. Please try again later.');
      }
    });
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
}
