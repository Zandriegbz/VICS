import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Visitor } from '../models/visitor.model';

import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface JsonBinResponse {
  record: {
    Visitors: Array<Omit<Visitor, 
      'id' | 'open' | 'status' | 'date' | 'time' | 'clientId' | 'middleInitial'
    >>;
  };
  metadata?: any;
}

@Injectable({
  providedIn: 'root'
})
export class VisitorService {
  private binId = '6843bac08561e97a502086bf';
  private apiUrl = `https://api.jsonbin.io/v3/b/${this.binId}`;

  constructor(
    private http: HttpClient
  ) { }

  getVisitors(): Observable<Visitor[]> {
    return this.http.get<JsonBinResponse>(`${this.apiUrl}/latest`).pipe(
      map(response => {
        if (!response.record?.Visitors) {
          throw new Error('Invalid data format: Missing Visitors array');
        }
        
        // Reverse the array to get LIFO ordering (newest first)
        const reversedVisitors = [...response.record.Visitors].reverse();
        
        return reversedVisitors.map((visitor, index) => 
          this.transformVisitor(visitor, this.generateId(index))
        );
      }),
      catchError(error => {
        handleError(error);
        return throwError(() => new Error('Failed to fetch visitors'));
      })
    );
  }

  getVisitor(id: string): Observable<Visitor> {
    return this.getVisitors().pipe(
      map(visitors => {
        const visitor = visitors.find(v => v.id === id);
        if (!visitor) {
          throw new Error(`Visitor with id ${id} not found`);
        }
        return visitor;
      })
    );
  }

  private transformVisitor(
    visitor: Omit<Visitor, 'id' | 'open' | 'status' | 'date' | 'time' | 'clientId' | 'middleInitial'>,
    id: string
  ): Visitor {
    const dt = new Date(visitor.DateTime);
    return {
      ...visitor,
      id: id,
      open: false,
      status: visitor.CertificateNeeded === 'Yes' ? 'Printed' : 'Not Printed',
      date: dt.toISOString().split('T')[0],
      time: dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      clientId: 'CL' + id,
      middleInitial: visitor.Middlename ? visitor.Middlename[0] + '.' : '',
      // Ensure all required fields have defaults
      Suffix: visitor.Suffix || '',
      Specificpurpose: visitor.Specificpurpose || ''
    };
  }

  private generateId(index: number): string {
    return index.toString().padStart(4, '0');
  }
}

function handleError(error: any) {
  console.error('API Error:', error);
  // In a real app, you might use a more sophisticated error handling strategy,
  // like a remote logging service or user-facing notifications.
}
