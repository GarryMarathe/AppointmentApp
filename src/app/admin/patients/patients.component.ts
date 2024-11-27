import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, finalize, of } from 'rxjs';
import { PatientService } from '../../services/patient/patient.service';  // New service
import { Patient } from '../../model';  // Patient model
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'serialNo',
    'name',
    'age',
    'bloodGroup',
    'city',
    'gender',
    'contact',
    'lastVisit',
    'totalAppointments'
  
  ];
  dataSource = new MatTableDataSource<Patient>([]);
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private patientService: PatientService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadPatients() {
    this.isLoading = true;
    this.patientService.getPatients().pipe(
      catchError(error => {
        console.error('Error loading patients:', error);
        return of([]);  // Return an empty array in case of error
      }),
      finalize(() => this.isLoading = false)
    ).subscribe(res => {
      // Assign serial numbers to patients
      const patientsWithSerialNumbers = res.patients.map((patient: any, index: number) => ({
        ...patient,
        serialNo: index + 1  // Add serial number
      }));
      this.dataSource.data = patientsWithSerialNumbers;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewPatient(patientId: string) {
    // Implement viewing logic
  }

  editPatient(patientId: string) {
    // Implement editing logic
  }

  deletePatient(patientId: string) {
    // Implement deletion logic
  }

  openAddPatientModal() {
    // Open modal for adding a new patient
  }
}
