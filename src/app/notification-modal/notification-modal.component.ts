import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Notification } from '../models/notification.model';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.css']
})
export class NotificationModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}
  
  ngOnInit(): void {
    this.loadNotifications();
  }
  
  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  closeNotifications() {
    this.closeModal.emit();
  }

  markAllRead() {
    this.notificationService.markAllAsRead(this.notifications).subscribe(updatedNotifications => {
      this.notifications = updatedNotifications;
    });
  }

  clearAll() {
    this.notificationService.clearAll().subscribe(() => {
      this.notifications = [];
    });
  }
}
