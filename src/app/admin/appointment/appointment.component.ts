import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface Appointment {
  doctorName: string;
  specialty: string;
  patientName: string;
  appointmentTime: string;
  amount: number;
}

const ELEMENT_DATA: Appointment[] = [
  {
    doctorName: 'Dr. John Doe',
    specialty: 'Cardiology',
    patientName: 'Alice Smith',
    appointmentTime: '2024-10-30 10:00 AM',
    amount: 1500
  },
  {
    doctorName: 'Dr. Jane Roe',
    specialty: 'Neurology',
    patientName: 'Bob Johnson',
    appointmentTime: '2024-10-30 11:00 AM',
    amount: 2000
  },
  {
    doctorName: 'Dr. Emily Davis',
    specialty: 'Pediatrics',
    patientName: 'Charlie Brown',
    appointmentTime: '2024-10-30 12:00 PM',
    amount: 1000
  },
  {
    doctorName: 'Dr. Michael Lee',
    specialty: 'Orthopedics',
    patientName: 'Daisy Adams',
    appointmentTime: '2024-10-30 01:00 PM',
    amount: 1800
  },
  {
    doctorName: 'Dr. Sarah Wilson',
    specialty: 'Dermatology',
    patientName: 'Edward Miller',
    appointmentTime: '2024-10-30 02:00 PM',
    amount: 1200
  },
  {
    doctorName: 'Dr. Robert Brown',
    specialty: 'Ophthalmology',
    patientName: 'Frank White',
    appointmentTime: '2024-10-30 03:00 PM',
    amount: 1300
  },
  {
    doctorName: 'Dr. Lisa Anderson',
    specialty: 'Gynecology',
    patientName: 'Grace Taylor',
    appointmentTime: '2024-10-30 04:00 PM',
    amount: 1700
  },
  {
    doctorName: 'Dr. David Clark',
    specialty: 'Psychiatry',
    patientName: 'Henry Wilson',
    appointmentTime: '2024-10-31 10:00 AM',
    amount: 2500
  },
  {
    doctorName: 'Dr. Maria Garcia',
    specialty: 'Endocrinology',
    patientName: 'Isabel Lopez',
    appointmentTime: '2024-10-31 11:00 AM',
    amount: 1900
  },
  {
    doctorName: 'Dr. James Wilson',
    specialty: 'Cardiology',
    patientName: 'Jack Thompson',
    appointmentTime: '2024-10-31 12:00 PM',
    amount: 1500
  },
  {
    doctorName: 'Dr. Patricia Martinez',
    specialty: 'Pediatrics',
    patientName: 'Kelly Brown',
    appointmentTime: '2024-10-31 01:00 PM',
    amount: 1000
  },
  {
    doctorName: 'Dr. Thomas Anderson',
    specialty: 'Orthopedics',
    patientName: 'Laura Davis',
    appointmentTime: '2024-10-31 02:00 PM',
    amount: 1800
  }
];

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule
  ],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'serialNumber',
    'doctor',
    'specialty',
    'patient',
    'appointmentTime',
    'amount'
  ];
  dataSource = new MatTableDataSource<Appointment>(ELEMENT_DATA);
  currentPage = 0;
  pageSize = 8;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    // Initial setup if needed
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    if (this.paginator) {
      this.paginator.pageSize = this.pageSize;
    }
  }

  calculateSerialNumber(index: number): number {
    return this.currentPage * this.pageSize + index + 1;
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
  }
}