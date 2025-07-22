import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Visitor } from '../models/visitor.model';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { VicsApiEndpointsService } from './vics-api-endpoints.service';


@Injectable({
  providedIn: 'root'
})
export class VisitorService {
  private apiUrl2 = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private api: VicsApiEndpointsService
  ) {}

getVisitors(): Observable<Visitor[]> {
  return this.http.get<Visitor[]>(`${this.apiUrl2}${this.api.getVisitors()}`).pipe(
    map(visitors => {
      if (!Array.isArray(visitors)) {
        throw new Error('Invalid data format: Expected an array of visitors');
      }

      const reversedVisitors = [...visitors].reverse();

      return reversedVisitors.map((visitor, index) =>
        this.transformVisitor(visitor, this.generateId(index))
      );
    }),
    catchError(handleError('Fetching visitors'))
  );
}


  getVisitorCertificate(visitorId: string): Observable<Blob> {
  return this.http.get(`${this.apiUrl2}${this.api.getVisitorCertificate(visitorId)}`, {
     responseType: 'blob' ,
      headers : new  HttpHeaders  ({
        'Accept': 'application/pdf' 
      })  
    });
}

  private transformVisitor(
  visitor: any, // Use `any` if needed to handle mismatches
  id: string
): Visitor {
  const dt = new Date(visitor.dateTimeCreated);

  return {
    ...visitor,
    id: id,
    open: false,
    status: visitor.isPrinted ? 'Printed' : 'Not Printed',
    date: dt.toISOString().split('T')[0],
    time: dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    clientId: visitor.clientID || 'CL' + id,
    middleInitial: visitor.middleName ? visitor.middleName[0] + '.' : '',
    Suffix: visitor.suffixName || '',
    Specificpurpose: visitor.purpose || ''
  };
}

  private generateId(index: number): string {
    return index.toString().padStart(4, '0');
  }
}

function handleError(operation: string) {
  return (error: any) => {
    console.error(`${operation} failed:`, error);
    return throwError(() => new Error(`${operation} failed: ${error.message || error}`));
  };
}


