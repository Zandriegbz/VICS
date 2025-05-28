import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../services/auth.service';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from '../services/spinner.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LoginComponent {
  username = '';
  password = '';
  isLoading = false;
  showError = false;
  errorMessage = '';
  returnUrl: string = '/admin/dashboard'; // Default return URL

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private spinnerService: SpinnerService
  ) {
    // Get return URL from route parameters or default to '/admin/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
    
    // If already logged in, redirect to the admin dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit() {
    this.showError = false;
    this.errorMessage = '';
    this.isLoading = true;
    
    // Show spinner for login
    this.spinnerService.show();

    this.authService.login(this.username, this.password)
      .pipe(
        // Make sure to finalize to reset loading state even if there's an error
        finalize(() => {
          this.isLoading = false;
          // Always force hide the spinner
          this.spinnerService.forceHide();
        })
      )
      .subscribe({
        next: (result) => {
          if (result.success) {
            this.router.navigate([this.returnUrl]);
          } else {
            this.showError = true;
            this.errorMessage = result.message || 'Invalid username or password. Please try again.';
          }
        },
        error: (error) => {
          this.showError = true;
          this.errorMessage = 'An error occurred during login. Please try again.';
          console.error('Login error:', error);
        }
      });
  }
}
