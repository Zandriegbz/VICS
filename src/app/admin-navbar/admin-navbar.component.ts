import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css'],
  standalone: false
})
export class AdminNavbarComponent {
  showNotification = false;
  showAccount = false;

  user$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.currentUser$; 
  }

  toggleNotification() {
    this.showNotification = !this.showNotification;
    if (this.showNotification) {
      this.showAccount = false;
    }
  }

  toggleAccount() {
    this.showAccount = !this.showAccount;
    if (this.showAccount) {
      this.showNotification = false;
    }
  }
}
