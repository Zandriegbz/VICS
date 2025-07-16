import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css'],
    standalone: false
})
export class ForgotPasswordComponent {
  email = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.email) {
      Swal.fire({
        icon: 'warning',
        title: 'Email Required',
        text: 'Please enter your email address.',
        confirmButtonText: 'Ok'
      });
      return;
    }

    if (!this.validateEmail(this.email)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
        confirmButtonText: 'Ok'
      });
      return;
    }

    this.isLoading = true;

    this.authService.resetPassword(this.email).subscribe({
      next: (result) => {
        this.isLoading = false;
        if (result.success) {
          Swal.fire({
            icon: 'info',
            title: 'Password Reset',
            text: result.message,
            confirmButtonText: 'Ok'
          });
          // Redirect to login after 3 seconds
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Reset Failed',
            text: result.message,
            confirmButtonText: 'Ok'
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Reset Failed',
          text: 'An unexpected error occurred. Please try again later.',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
}
