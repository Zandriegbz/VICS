import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {
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
  ) {}
  
  ngOnInit(): void {
    // Get return URL from route parameters or default to '/admin/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
    
    // If already logged in, redirect to the return URL
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit(): void {
    // Reset error state
    this.showError = false;
    this.errorMessage = '';
    
    // Validate form
    if (!this.username || !this.password) {
      this.showError = true;
      this.errorMessage = 'Please enter both username and password';
      return;
    }
    
    // Set loading state
    this.isLoading = true;
    this.spinnerService.show();

    this.authService.login(this.username, this.password)
      .pipe(
        finalize(() => {
          this.isLoading = false;
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
