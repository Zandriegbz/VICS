import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from '../services/spinner.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  isLoading = false;
  returnUrl: string = '/admin/dashboard'; // default return url

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private spinnerService: SpinnerService
  ) {}
  
  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
    
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit(): void {
    if (!this.username || !this.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please enter both username and password',
        confirmButtonText: 'Ok'
      });
      return;
    }
    
    // loading state
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
            Swal.fire({
              icon: 'success',
              title: 'Login Successful!',
              text: 'Welcome!',
              timer: 1500,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate([this.returnUrl]);
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Login Failed',
              text: result.message || 'Invalid username or password. Please try again.',
              confirmButtonText: 'Try Again'
            });
          }
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Login Error',
            text: 'An unexpected error occurred during login. Please try again later.',
            confirmButtonText: 'Ok'
          });
          console.error('Login error:', error);
        }
      });
  }
}
