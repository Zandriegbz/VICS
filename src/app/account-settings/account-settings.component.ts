import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../models/user.model';

@Component({
    selector: 'app-account-settings',
    templateUrl: './account-settings.component.html',
    styleUrls: ['./account-settings.component.css'],
    standalone: false
})
export class AccountSettingsComponent {
  
  user$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.currentUser$; 
  }

  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
}
