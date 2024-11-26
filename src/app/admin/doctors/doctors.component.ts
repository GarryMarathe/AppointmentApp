import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddDoctorModalComponent } from './add-doctor-modal/add-doctor-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { DoctorDeleteDialogComponent } from './doctor-delete-dialog/doctor-delete-dialog.component';
import { ViewDoctorDialogComponent } from './view-doctor-dialog/view-doctor-dialog.component';
import { EditDoctorModalComponent } from './edit-doctor-modal/edit-doctor-modal.component';

import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, finalize, of, Subject, takeUntil } from 'rxjs';
import { DoctorService } from '../../services/doctor/doctor.service';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { Doctor, Specialty } from '../../model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';





@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule,
    ViewDoctorDialogComponent,
    MatLabel,
    MatFormFieldModule,
    MatTooltipModule,
    FormsModule

    
  ],
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit {
  displayedColumns: string[] = [
    'doctorId',
    'doctorName',
    'specialization',
    'contactNumber',
    'fees',
    'experience',
    'reviews',
    'earnings',
    'actions'
  ];
  dataSource = new MatTableDataSource<any>();
  isLoading = false;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  specializations!: Specialty[] | never[];
  specialties: any;
  

  constructor(
    private dialog: MatDialog,
    private doctorsService: DoctorService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Doctor>([]);
  }

  ngOnInit(): void {
    // this.loadSpecializations();
    this.loadDoctors();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // loadSpecializations() {
  //   this.isLoading = true;
  //   this.doctorsService.getSpecialties().pipe(
  //     catchError(error => {
  //       console.error('Error loading specializations:', error);
  //       return of([]);
  //     }),
  //     finalize(() => this.isLoading = false)
  //   ).subscribe(specializations => {
  //     this.specializations = specializations;
  //   });
  // }

  loadDoctors() {
    this.isLoading = true;
    this.doctorsService.getDoctors().pipe(
      catchError(error => {
        console.error('Error loading doctors:', error);
        return of([]); // Return an empty array in case of error
      }),
      finalize(() => this.isLoading = false)
    ).subscribe(res => {
      this.dataSource.data = res.doctors;  // Assign data to the dataSource
    });
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // getSpecializationName(specializationId: number): string {
  //   const specialization = this.specializations.find(s => s._id === specializationId);
  //   return specialization?.name || 'Unknown';
  // }

  // viewDoctor(doctorId: number) {
  //   console.log('View doctor:', doctorId);
  // }

  viewDoctor(doctorId: string) {
    this.isLoading = true;
    console.log(doctorId)
    this.doctorsService.getDoctorById(doctorId).pipe(
      catchError(error => {
        
        console.error('Error loading doctor details:', error);
        this.showError('Failed to load doctor details. Please try again.');
        return of({ doctor: null });
      }),
      finalize(() => this.isLoading = false)
    ).subscribe(result => {
      if (result.doctor) {
        this.openViewDialog(result.doctor);
      }
    });
  }
  showError(arg0: string) {
    throw new Error('Method not implemented.');
  }

  private openViewDialog(doctor: Doctor) {
    this.dialog.open(ViewDoctorDialogComponent, {
      width: '600px',
      data: {
        doctor: doctor,
        specialties: this.specialties
      }
    });
  }
  editDoctor(doctorId: number) {
    console.log('Edit doctor:', doctorId);
  }


 deleteDoctor(doctorId: string) {
  // Ensure dialog is opened correctly
  const dialogRef = this.dialog.open(DoctorDeleteDialogComponent, {
    width: '400px',
    data: {
      id: doctorId,
      name: this.dataSource.data.find(doctor => doctor._id === doctorId)?.doctorName || 'this doctor'
    }
  });

  // Handling after dialog is closed
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // Show loading spinner while deleting
      this.isLoading = true;
      
      // Call the doctorsService to delete the doctor
      this.doctorsService.deleteDoctor(doctorId).pipe(
        // Handle errors
        catchError(error => {
          console.error('Error deleting doctor:', error);
          this.snackBar.open('Failed to delete doctor. Please try again.', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          return of(null); // Return an empty observable on error
        }),
        // Finalize action, whether success or failure
        finalize(() => {
          this.isLoading = false;
        })
      ).subscribe({
        next: () => {
          // Display success message
          this.snackBar.open('Doctor deleted successfully', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          // Refresh the list of doctors after deletion
          this.loadDoctors(); 
        }
      });
    }
  });
}

  openAddDoctorModal() {
    const dialogRef = this.dialog.open(AddDoctorModalComponent, {
      width: '600px',
      disableClose: true,
      data: {
        specialties: this.specialties
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refresh the doctors list or perform any other necessary updates
        this.loadDoctors();
      }
    });
  }

  
}