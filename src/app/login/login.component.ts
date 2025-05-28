import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../services/auth.service';

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
    private authService: AuthService
  ) {
    // Get return URL from route parameters or default to '/admin/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
    
    // If already logged in, redirect to the admin dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  async onSubmit() {
    this.showError = false;
    this.errorMessage = '';
    this.isLoading = true;

    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.authService.login(this.username, this.password).subscribe(result => {
      if (result.success) {
        this.router.navigate([this.returnUrl]);
      } else {
        this.showError = true;
        this.errorMessage = result.message || 'Invalid username or password. Please try again.';
      }
      this.isLoading = false;
    });
  }
}
