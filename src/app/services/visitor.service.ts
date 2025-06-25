import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, delay } from 'rxjs/operators';
import { Visitor } from '../models/visitor.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { api } from '../connection';
import Swal from 'sweetalert2';
import { VicsApiEndpointsService } from './vics-api-endpoints.service';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {
  // mock data for development
  private mockVisitors: Visitor[] = [
    {
      clientId: '001',
      firstname: 'John',
      lastname: 'Doe',
      middleInitial: 'A',
      position: 'Manager',
      agency: 'ABC Corporation',
      purpose: 'Meeting with HR',
      date: '2025-06-09',
      time: '09:30',
      status: 'Printed',
      open: false
    },
    {
      clientId: '002',
      firstname: 'Alice',
      lastname: 'Johnson',
      middleInitial: 'B',
      position: 'Developer',
      agency: 'Tech Solutions',
      purpose: 'Job Interview',
      date: '2025-06-09',
      time: '14:15',
      status: 'Not Printed',
      open: false
    },
    {
      clientId: '003',
      firstname: 'Michael',
      lastname: 'Brown',
      middleInitial: 'C',
      position: 'Citizen',
      agency: 'Self',
      purpose: 'Permit Application',
      date: '2025-06-09',
      time: '10:00',
      status: 'Printed',
      open: false
    },
    {
      clientId: '004',
      firstname: 'Sarah',
      lastname: 'Wilson',
      middleInitial: 'D',
      position: 'Consultant',
      agency: 'Wilson Consulting',
      purpose: 'Document Submission',
      date: '2025-06-09',
      time: '15:45',
      status: 'Not Printed',
      open: false
    },
    {
      clientId: '006',
      firstname: 'John Doe',
      lastname: 'Smith',
      middleInitial: 'C',
      position: 'Architect',
      agency: 'Design Firm',
      purpose: 'Consultation',
      date: '2025-06-16',
      time: '12:30',
      status: 'Not Printed',
      open: false
    }
  ];

  constructor(
    private http: HttpClient,
    private apiEndpoints: VicsApiEndpointsService
  ) { }

  getVisitors(): Observable<Visitor[]> {
    // mock data for development
    return of(this.mockVisitors).pipe(delay(800));
    
    // uncomment for backend
    /*
    return this.http.get<Visitor[]>(`${api}${this.apiEndpoints.getVisitors()}`).pipe(
      catchError(err => this.handleError(err, 'Failed to retrieve visitors'))
    );
    */
  }

  addVisitor(visitor: Visitor): Observable<Visitor> {
    // mock data for development
    const newVisitor: Visitor = {
      ...visitor,
      clientId: 'MOCK-' + Math.floor(Math.random() * 10000).toString(),
      status: 'Not Printed'
    };
    
    this.mockVisitors.push(newVisitor);
    
    return of(newVisitor).pipe(
      delay(800),
      tap(response => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Visitor ${visitor.firstname} ${visitor.lastname} added successfully`,
          confirmButtonText: 'Ok'
        });
      })
    );
    
    // uncomment for the backend
    /*
    return this.http.post<Visitor>(`${api}${this.apiEndpoints.addVisitor()}`, visitor).pipe(
      tap(response => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Visitor ${visitor.firstname} ${visitor.lastname} added successfully`,
          confirmButtonText: 'Ok'
        });
      }),
      catchError(err => this.handleError(err, 'Failed to add visitor'))
    );
    */
  }

  updateVisitor(visitor: Visitor): Observable<Visitor> {
    // mock data for development
    const index = this.mockVisitors.findIndex(v => v.clientId === visitor.clientId);
    if (index !== -1) {
      this.mockVisitors[index] = visitor;
    }
    
    return of(visitor).pipe(
      delay(800),
      tap(response => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Visitor ${visitor.firstname} ${visitor.lastname} updated successfully`,
          confirmButtonText: 'Ok'
        });
      })
    );
    
    // uncomment for the backend
    /*
    return this.http.put<Visitor>(`${api}${this.apiEndpoints.updateVisitor(visitor.clientId)}`, visitor).pipe(
      tap(response => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Visitor ${visitor.firstname} ${visitor.lastname} updated successfully`,
          confirmButtonText: 'Ok'
        });
      }),
      catchError(err => this.handleError(err, 'Failed to update visitor'))
    );
    */
  }

  deleteVisitor(clientId: string): Observable<void> {
    // mock data for development
    const index = this.mockVisitors.findIndex(v => v.clientId === clientId);
    if (index !== -1) {
      this.mockVisitors.splice(index, 1);
    }
    
    return of(undefined).pipe(
      delay(800),
      tap(response => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Visitor deleted successfully',
          confirmButtonText: 'Ok'
        });
      })
    );
    
    // uncomment for the backend
    /*
    return this.http.delete<void>(`${api}${this.apiEndpoints.deleteVisitor(clientId)}`).pipe(
      tap(response => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Visitor deleted successfully',
          confirmButtonText: 'Ok'
        });
      }),
      catchError(err => this.handleError(err, 'Failed to delete visitor'))
    );
    */
  }



  private handleError(error: HttpErrorResponse, message: string): Observable<never> {
    console.error(error);
    
    // sweetalert notif
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `${message}: ${error.error?.message || error.message || 'Unknown error occurred'}`,
      confirmButtonText: 'Ok'
    });
    
    return throwError(() => new Error(message));
  }
} 
