export interface Visitor {
  id: string;
  Firstname: string;
  Middlename: string;
  Lastname: string;
  Suffix: string;
  Agency: string;
  Position: string;
  Purpose: string;
  Specificpurpose: string;
  DateTime: string; // ISO date
  CertificateNeeded: 'Yes' | 'No';

  // UI fields
  open: boolean;
  status: 'Printed' | 'Not Printed';
  date: string;
  time: string;
  clientId: string;
  middleInitial: string;
}