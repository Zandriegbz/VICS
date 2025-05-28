import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Visitor } from '../models/visitor.model';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {

  private mockVisitors: Visitor[] = [
    {
      clientId: 'CL001',
      lastname: 'Garcia',
      firstname: 'Juan',
      middleInitial: 'D.',
      position: 'Manager',
      agency: 'DPWH',
      purpose: 'Meeting',
      date: '2025-05-18',
      time: '10:30 AM',
      status: 'Printed',
      open: false
    },
    {
      clientId: 'CL002',
      lastname: 'Santos',
      firstname: 'Maria',
      middleInitial: 'L.',
      position: 'Engineer',
      agency: 'LGU',
      purpose: 'Documentation',
      date: '2025-05-18',
      time: '11:00 AM',
      status: 'Not Printed',
      open: false
    },
    {
      clientId: 'CL002',
      lastname: 'Penaso',
      firstname: 'Ethel Dawn',
      middleInitial: 'T.',
      position: 'Engineer',
      agency: 'LGU',
      purpose: 'Documentation',
      date: '2025-05-18',
      time: '11:00 AM',
      status: 'Not Printed',
      open: false
    },
    {
      clientId: 'CL002',
      lastname: 'Narciso',
      firstname: 'Joseph Angelo',
      middleInitial: 'A.',
      position: 'Engineer',
      agency: 'LGU',
      purpose: 'Documentation',
      date: '2025-05-18',
      time: '11:00 AM',
      status: 'Not Printed',
      open: false
    },
    {
      clientId: 'CL002',
      lastname: 'Rizal',
      firstname: 'Jose',
      middleInitial: 'L.',
      position: 'Engineer',
      agency: 'LGU',
      purpose: 'Documentation',
      date: '2025-05-18',
      time: '11:00 AM',
      status: 'Not Printed',
      open: false
    },
    {
      clientId: 'CL002',
      lastname: 'Lutbo',
      firstname: 'Wael Hee',
      middleInitial: 'L.',
      position: 'Engineer',
      agency: 'LGU',
      purpose: 'Documentation',
      date: '2025-05-18',
      time: '11:00 AM',
      status: 'Not Printed',
      open: false
    },
    {
      clientId: 'CL004',
      lastname: 'Dela Cruz',
      firstname: 'Anna',
      middleInitial: 'B.',
      position: 'Secretary',
      agency: 'DOH',
      purpose: 'Health Report',
      date: '2025-05-18',
      time: '2:00 PM',
      status: 'Not Printed',
      open: false
    },
    {
      clientId: 'CL005',
      lastname: 'Torres',
      firstname: 'Marco',
      middleInitial: 'T.',
      position: 'Architect',
      agency: 'LGU',
      purpose: 'Consultation',
      date: '2025-05-18',
      time: '2:45 PM',
      status: 'Printed',
      open: false
    },
    {
      clientId: 'CL006',
      lastname: 'Lopez',
      firstname: 'Bea',
      middleInitial: 'C.',
      position: 'Analyst',
      agency: 'DTI',
      purpose: 'Market Report',
      date: '2025-05-18',
      time: '3:30 PM',
      status: 'Not Printed',
      open: false
    },
    {
      clientId: 'CL007',
      lastname: 'Fernandez',
      firstname: 'Nico',
      middleInitial: 'J.',
      position: 'Intern',
      agency: 'DOST',
      purpose: 'Interview',
      date: '2025-05-18',
      time: '4:15 PM',
      status: 'Printed',
      open: false
    },
    {
      clientId: 'CL008',
      lastname: 'Ramos',
      firstname: 'Liza',
      middleInitial: 'E.',
      position: 'Supervisor',
      agency: 'DA',
      purpose: 'Project Proposal',
      date: '2025-05-18',
      time: '5:00 PM',
      status: 'Not Printed',
      open: false
    },
    {
      clientId: 'CL009',
      lastname: 'Gutierrez',
      firstname: 'Manny',
      middleInitial: 'G.',
      position: 'Director',
      agency: 'CHED',
      purpose: 'Budget Meeting',
      date: '2025-05-18',
      time: '5:45 PM',
      status: 'Printed',
      open: false
    },
    {
      clientId: 'CL010',
      lastname: 'Villanueva',
      firstname: 'Karla',
      middleInitial: 'S.',
      position: 'Assistant',
      agency: 'NEDA',
      purpose: 'Follow-up',
      date: '2025-05-18',
      time: '6:30 PM',
      status: 'Not Printed',
      open: false
    }
  ];

  constructor(private errorService: ErrorService) { }

  getVisitors(): Observable<Visitor[]> {
    try {
      return of(JSON.parse(JSON.stringify(this.mockVisitors)));
    } catch (error) {
      this.errorService.showError('Failed to retrieve visitors', error instanceof Error ? error.message : String(error));
      return of([]);
    }
  }

  addVisitor(visitor: Visitor): Observable<boolean> {
    try {
      // In a real app, this would make an API call
      this.mockVisitors.push(visitor);
      this.errorService.showInfo('Visitor added successfully', `Added ${visitor.firstname} ${visitor.lastname}`);
      return of(true);
    } catch (error) {
      this.errorService.showError('Failed to add visitor', error instanceof Error ? error.message : String(error));
      return of(false);
    }
  }

  updateVisitor(visitor: Visitor): Observable<boolean> {
    try {
      // In a real app, this would make an API call
      const index = this.mockVisitors.findIndex(v => v.clientId === visitor.clientId);
      if (index !== -1) {
        this.mockVisitors[index] = visitor;
        this.errorService.showInfo('Visitor updated successfully', `Updated ${visitor.firstname} ${visitor.lastname}`);
        return of(true);
      } else {
        this.errorService.showWarning('Visitor not found', `Could not find visitor with ID ${visitor.clientId}`);
        return of(false);
      }
    } catch (error) {
      this.errorService.showError('Failed to update visitor', error instanceof Error ? error.message : String(error));
      return of(false);
    }
  }

  deleteVisitor(clientId: string): Observable<boolean> {
    try {
      // In a real app, this would make an API call
      const index = this.mockVisitors.findIndex(v => v.clientId === clientId);
      if (index !== -1) {
        const deletedVisitor = this.mockVisitors[index];
        this.mockVisitors.splice(index, 1);
        this.errorService.showInfo('Visitor deleted successfully', `Deleted ${deletedVisitor.firstname} ${deletedVisitor.lastname}`);
        return of(true);
      } else {
        this.errorService.showWarning('Visitor not found', `Could not find visitor with ID ${clientId}`);
        return of(false);
      }
    } catch (error) {
      this.errorService.showError('Failed to delete visitor', error instanceof Error ? error.message : String(error));
      return of(false);
    }
  }
} 