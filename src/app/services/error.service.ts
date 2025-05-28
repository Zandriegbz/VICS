import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ErrorMessage {
  message: string;
  type: 'error' | 'warning' | 'info';
  details?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorSubject = new Subject<ErrorMessage>();
  errors$: Observable<ErrorMessage> = this.errorSubject.asObservable();

  constructor() { }

  showError(message: string, details?: string): void {
    this.errorSubject.next({
      message,
      type: 'error',
      details
    });
    console.error(`Error: ${message}`, details || '');
  }

  showWarning(message: string, details?: string): void {
    this.errorSubject.next({
      message,
      type: 'warning',
      details
    });
    console.warn(`Warning: ${message}`, details || '');
  }

  showInfo(message: string, details?: string): void {
    this.errorSubject.next({
      message,
      type: 'info',
      details
    });
    console.info(`Info: ${message}`, details || '');
  }

  // Helper method to handle HTTP errors
  handleHttpError(error: any): void {
    let errorMessage = 'An unknown error occurred';
    let errorDetails = '';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} ${error.statusText}`;
      errorDetails = error.error?.message || JSON.stringify(error.error);
    }
    
    this.showError(errorMessage, errorDetails);
  }
} 