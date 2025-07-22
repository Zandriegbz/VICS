  // export interface Visitor {
  //   id: string;
  //   Firstname: string;
  //   Middlename: string;
  //   Lastname: string;
  //   Suffix: string;
  //   Agency: string;
  //   Position: string;
  //   Purpose: string;
  //   Specificpurpose: string;
  //   DateTime: string; // ISO date
  //   CertificateNeeded: 'Yes' | 'No';

  //   // UI fields
  //   open: boolean;
  //   status: 'Printed' | 'Not Printed';
  //   date: string;
  //   time: string;
  //   clientId: string;
  //   middleInitial: string;
  // }

 export interface Visitor {
  id: string;
  open: boolean;
  status: string;
  date: string;
  time: string;
  clientId: string;
  middleInitial: string;
  Suffix: string;
  Specificpurpose: string;
  // Plus your actual backend fields
  clientID: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffixName: string;
  position: string;
  agency: string;
  purpose: string;
  dateTimeCreated: string;
  isPrinted: boolean;
  dateTimePrinted: string | null;
}

type VisitorsResponse = Visitor[];
