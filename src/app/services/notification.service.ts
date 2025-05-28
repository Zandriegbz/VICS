import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, delay } from 'rxjs/operators';
import { Notification } from '../models/notification.model';
import { ErrorService } from './error.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { api } from '../connection';
import Swal from 'sweetalert2';
import { VicsApiEndpointsService } from './vics-api-endpoints.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Mock data for development purposes
  private mockNotifications: Notification[] = [
    {
      message: 'New visitor John Doe has checked in',
      time: '09:30 AM',
      read: false
    },
    {
      message: 'Meeting with HR department at 11:00 AM',
      time: '08:45 AM',
      read: true
    },
    {
      message: 'Visitor Alice Johnson has checked out',
      time: 'Yesterday',
      read: true
    },
    {
      message: 'System maintenance scheduled for tonight at 10:00 PM',
      time: 'Yesterday',
      read: false
    },
    {
      message: 'New security policy update',
      time: '2 days ago',
      read: true
    }
  ];

  constructor(
    private errorService: ErrorService,
    private http: HttpClient,
    private apiEndpoints: VicsApiEndpointsService
  ) { }

  getNotifications(): Observable<Notification[]> {
    // Use mock data in development mode
    return of(this.mockNotifications).pipe(delay(800));
    
    // Uncomment when backend is ready
    /*
    return this.http.get<Notification[]>(`${api}${this.apiEndpoints.getNotifications()}`).pipe(
      catchError(err => this.handleError(err, 'Failed to retrieve notifications'))
    );
    */
  }

  markAllAsRead(notifications: Notification[]): Observable<Notification[]> {
    // Use mock data in development mode
    this.mockNotifications.forEach(notification => {
      notification.read = true;
    });
    
    return of(this.mockNotifications).pipe(
      delay(800),
      tap(response => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'All notifications marked as read',
          confirmButtonText: 'Ok'
        });
      })
    );
    
    // Uncomment when backend is ready
    /*
    return this.http.put<Notification[]>(`${api}${this.apiEndpoints.getNotifications()}/mark-all-read`, {}).pipe(
      tap(response => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'All notifications marked as read',
          confirmButtonText: 'Ok'
        });
      }),
      catchError(err => this.handleError(err, 'Failed to mark notifications as read'))
    );
    */
  }

  clearAll(): Observable<Notification[]> {
    // Use mock data in development mode
    this.mockNotifications = [];
    
    return of([]).pipe(
      delay(800),
      tap(response => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'All notifications cleared',
          confirmButtonText: 'Ok'
        });
      })
    );
    
    // Uncomment when backend is ready
    /*
    return this.http.delete<Notification[]>(`${api}${this.apiEndpoints.getNotifications()}`).pipe(
      tap(response => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'All notifications cleared',
          confirmButtonText: 'Ok'
        });
      }),
      catchError(err => this.handleError(err, 'Failed to clear notifications'))
    );
    */
  }

  addNotification(notification: Notification): Observable<Notification> {
    // Use mock data in development mode
    this.mockNotifications.unshift(notification);
    
    return of(notification).pipe(
      delay(800),
      tap(response => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Notification added successfully',
          confirmButtonText: 'Ok'
        });
      })
    );
    
    // Uncomment when backend is ready
    /*
    return this.http.post<Notification>(`${api}${this.apiEndpoints.getNotifications()}`, notification).pipe(
      tap(response => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Notification added successfully',
          confirmButtonText: 'Ok'
        });
      }),
      catchError(err => this.handleError(err, 'Failed to add notification'))
    );
    */
  }

  private handleError(error: HttpErrorResponse, message: string): Observable<never> {
    console.error(error);
    
    // For backward compatibility, also use the ErrorService
    this.errorService.handleHttpError(error);
    
    // Show SweetAlert2 notification
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `${message}: ${error.error?.message || error.message || 'Unknown error occurred'}`,
      confirmButtonText: 'Ok'
    });
    
    return throwError(() => new Error(message));
  }
} 