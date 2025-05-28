import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ErrorService, ErrorMessage } from '../../services/error.service';

@Component({
  selector: 'app-error-toast',
  templateUrl: './error-toast.component.html',
  styleUrls: ['./error-toast.component.css']
})
export class ErrorToastComponent implements OnInit, OnDestroy {
  messages: ErrorMessage[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private errorService: ErrorService) { }

  ngOnInit(): void {
    this.subscription = this.errorService.errors$.subscribe(error => {
      this.messages.push(error);
      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        this.dismissMessage(error);
      }, 5000);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  dismissMessage(message: ErrorMessage): void {
    const index = this.messages.indexOf(message);
    if (index !== -1) {
      this.messages.splice(index, 1);
    }
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'error': return 'fas fa-exclamation-circle';
      case 'warning': return 'fas fa-exclamation-triangle';
      case 'info': return 'fas fa-info-circle';
      default: return 'fas fa-bell';
    }
  }

  getToastClass(type: string): string {
    switch (type) {
      case 'error': return 'toast-error';
      case 'warning': return 'toast-warning';
      case 'info': return 'toast-info';
      default: return '';
    }
  }
}
