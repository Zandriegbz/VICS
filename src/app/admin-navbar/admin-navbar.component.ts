import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent {
  showNotification = false;
  showAccount = false;

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

