import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of } from 'rxjs';
import { Appointment } from '../../model';
import { AppointmentService } from '../../services/appointment/appointment.service';

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
export class AppointmentComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'appointmentId',
    'patientName',
    'appointmentDate',
    'doctorName',
    'specialty',
    'status',
  ];
  
  dataSource = new MatTableDataSource<Appointment>([]);
  isLoading = false;
  isDataLoaded = false;  // Guard variable to track if data has been loaded

  constructor(
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAppointments() {
    if (this.isDataLoaded) {
      return; // Prevent loading data again if already loaded
    }
  
    this.isLoading = true;
    
    this.appointmentService.getAppointments().pipe(
      catchError(error => {
        console.error('Error loading appointments:', error);
        this.snackBar.open('Failed to load appointments', 'Close', { duration: 3000 });
        return of([]);  // Return empty array on error
      })
    ).subscribe((response: any) => {
      const apiAppointments = response.appointments;
  
      if (Array.isArray(apiAppointments)) {
        const transformedAppointments: Appointment[] = apiAppointments.map(appointment => ({
          appointmentId: appointment._id,
          patientName: `${appointment.patientId.firstName} ${appointment.patientId.lastName}`,
          appointmentDate: appointment.appointmentDate,
          doctorId: appointment.doctorId._id,
          doctorName: `${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`,
          specialty: appointment.doctorId.speciality,
          status: appointment.paymentStatus // Using payment status as a proxy for appointment status
        }));
  
        // Ensure we only set the data once
        if (!this.isDataLoaded) {
          this.dataSource.data = transformedAppointments;
          this.isDataLoaded = true; // Mark data as loaded
        }
      } else {
        console.error('Appointments data is not an array:', apiAppointments);
        this.snackBar.open('Appointments data is invalid', 'Close', { duration: 3000 });
      }
  
      this.isLoading = false;
    });
  }
}  