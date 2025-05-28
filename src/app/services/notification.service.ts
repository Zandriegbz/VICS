import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Notification } from '../models/notification.model';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  private mockNotifications: Notification[] = [
    { message: 'You have 3 new messages.', time: '2 mins ago', read: false },
    { message: 'System maintenance scheduled for 10 PM.', time: '1 hour ago', read: false },
    { message: 'New user registered: John Doe.', time: 'Yesterday', read: true },
  ];

  constructor(private errorService: ErrorService) { }

  getNotifications(): Observable<Notification[]> {
    try {
      return of(JSON.parse(JSON.stringify(this.mockNotifications)));
    } catch (error) {
      this.errorService.showError('Failed to retrieve notifications', error instanceof Error ? error.message : String(error));
      return of([]);
    }
  }

  markAllAsRead(notifications: Notification[]): Observable<Notification[]> {
    try {
      const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
      return of(updatedNotifications);
    } catch (error) {
      this.errorService.showError('Failed to mark notifications as read', error instanceof Error ? error.message : String(error));
      return of(notifications); // Return original notifications unchanged
    }
  }

  clearAll(): Observable<Notification[]> {
    try {
      return of([]);
    } catch (error) {
      this.errorService.showError('Failed to clear notifications', error instanceof Error ? error.message : String(error));
      return of([]);
    }
  }

  addNotification(notification: Notification): Observable<boolean> {
    try {
      // In a real app, this would make an API call to add notification
      this.mockNotifications.unshift(notification);
      return of(true);
    } catch (error) {
      this.errorService.showError('Failed to add notification', error instanceof Error ? error.message : String(error));
      return of(false);
    }
  }
} 