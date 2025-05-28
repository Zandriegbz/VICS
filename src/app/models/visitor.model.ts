export interface Visitor {
  clientId: string;
  lastname: string;
  firstname: string;
  middleInitial: string;
  position: string;
  agency: string;
  purpose: string;
  date: string;
  time: string;
  status: 'Printed' | 'Not Printed';
  open: boolean;
} 