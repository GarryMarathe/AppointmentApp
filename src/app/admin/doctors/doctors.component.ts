import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Specialty } from '../specialities/specialities.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddDoctorModalComponent } from './add-doctor-modal/add-doctor-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { DoctorDeleteDialogComponent } from './doctor-delete-dialog/doctor-delete-dialog.component';
import { ViewDoctorDialogComponent } from './view-doctor-dialog/view-doctor-dialog.component';
import { EditDoctorModalComponent } from './edit-doctor-modal/edit-doctor-modal.component';

export interface Doctor {
  doctorId: number;
  doctorName: string;
  specializationId: string;
  contactNumber: string;
  fees: number;
  experience: number; // in years
  reviews: number; // number of reviews
  earnings: number; // total earnings
  rating: number;
  profileImage?: string; // Optional field for profile image
  aboutDoctor?: string;
  degree?: string;
  licenseNumber?: string;
  availableDays?: string[]; // New field for availability days
  timeSlot?: string; // New field for time slot
  email?: string; // New field for email
}

const DOCTOR_DATA: Doctor[] = [
  {
    doctorId: 1,
    doctorName: 'Dr. John Doe',
    specializationId: '1',
    contactNumber: '9876543210',
    fees: 1500,
    experience: 10,
    reviews: 200,
    earnings: 300000,
    rating: 4,
  },
  {
    doctorId: 2,
    doctorName: 'Dr. Jane Roe',
    specializationId: '2',
    contactNumber: '9123456789',
    fees: 2000,
    experience: 8,
    reviews: 150,
    earnings: 250000,
    rating: 3
  },
  {
    doctorId: 3,
    doctorName: 'Dr. Alice Smith',
    specializationId: '3',
    contactNumber: '9876543211',
    fees: 1800,
    experience: 5,
    reviews: 100,
    earnings: 150000,
    rating: 5,
  },
  {
    doctorId: 4,
    doctorName: 'Dr. Bob Johnson',
    specializationId: '1',
    contactNumber: '9123456780',
    fees: 1600,
    experience: 12,
    reviews: 250,
    earnings: 400000,
    rating: 4,
  },
  {
    doctorId: 5,
    doctorName: 'Dr. Carol Williams',
    specializationId: '2',
    contactNumber: '8765432109',
    fees: 2200,
    experience: 7,
    reviews: 180,
    earnings: 280000,
    rating: 3,
  },
  {
    doctorId: 6,
    doctorName: 'Dr. David Brown',
    specializationId: '4',
    contactNumber: '7654321098',
    fees: 2000,
    experience: 9,
    reviews: 120,
    earnings: 200000,
    rating: 4,
  },
  {
    doctorId: 7,
    doctorName: 'Dr. Emma Davis',
    specializationId: '5',
    contactNumber: '6543210987',
    fees: 2400,
    experience: 6,
    reviews: 90,
    earnings: 170000,
    rating: 5,
  },
  {
    doctorId: 8,
    doctorName: 'Dr. Frank Miller',
    specializationId: '6',
    contactNumber: '5432109876',
    fees: 2100,
    experience: 11,
    reviews: 140,
    earnings: 230000,
    rating: 3,
  },
  {
    doctorId: 9,
    doctorName: 'Dr. Grace Wilson',
    specializationId: '7',
    contactNumber: '4321098765',
    fees: 1900,
    experience: 4,
    reviews: 110,
    earnings: 160000,
    rating: 4,
  },
  {
    doctorId: 10,
    doctorName: 'Dr. Henry Moore',
    specializationId: '1',
    contactNumber: '3210987654',
    fees: 1700,
    experience: 15,
    reviews: 300,
    earnings: 500000,
    rating: 5,
  }
];

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
    
  ],
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'doctorId',
    'doctorName',
    'specialization',
    'contactNumber',
    'fees',
    'experience',
    'reviews',
    'earnings',
    'actions'  // Add actions column
  ];
  dataSource = new MatTableDataSource<Doctor>(DOCTOR_DATA);
  specialties: Specialty[] = [];

  constructor(private dialog: MatDialog) {}
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loadSpecialties();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadSpecialties() {
    this.specialties = [
      { id: '1', name: 'Cardiology' },
      { id: '2', name: 'Neurology' },
      { id: '3', name: 'Pediatrics' },
      { id: '4', name: 'Orthopedic' },
      { id: '5', name: 'Gynecology' },
      { id: '6', name: 'Urology' },
      { id: '7', name: 'Dentist' },
    ];
  }

    // formatContactNumber(contact: string): string {
    //   return `+91 ${contact.substring(0, 5)}-${contact.substring(5)}`;
    // }

  getSpecializationName(specializationId: string): string {
    const specialty = this.specialties.find(s => s.id === specializationId);
    return specialty ? specialty.name : 'Unknown';
  }

  // rateDoctor(doctorId: number, rating: number) {
  //   const doctor = this.dataSource.data.find(d => d.doctorId === doctorId);
  //   if (doctor) {
  //     doctor.reviews = rating * 50; // Assuming each star represents 50 reviews
  //     this.dataSource.data = [...this.dataSource.data]; // Refresh the data source
  //   }
  // }

  // viewDoctor(doctorId: number) {
  //   // Logic to view doctor details
  //   console.log('Viewing doctor with ID:', doctorId);
  // }

  // editDoctor(doctorId: number) {
  //   // Logic to edit doctor details
  //   console.log('Editing doctor with ID:', doctorId);
  // }

  // deleteDoctor(doctorId: number) {
  //   // Logic to delete doctor
  //   console.log('Deleting doctor with ID:', doctorId);
  //   this.dataSource.data.filter((d: { doctorId: number; }) => d.doctorId !== doctorId); // Remove the doctor from the data source
  // }
  openAddDoctorModal(): void {
    const dialogRef = this.dialog.open(AddDoctorModalComponent, {
      width: '80%',  // Set width to 80% of the viewport
      maxWidth: '600px',  // Maximum width of the dialog
      height: 'auto',  // Height adjusts based on content
      data: { specialties: this.specialties } // Pass specialties to the dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newDoctor: Doctor = {
          doctorId: this.dataSource.data.length + 1, // Increment ID based on current length
          doctorName: `${result.firstName} ${result.lastName}`, // Combine first and last name
          specializationId: result.specializationId,
          contactNumber: result.contactNumber,
          fees: result.fees,
          experience: result.experience,
          reviews: 0, // Initialize reviews
          earnings: 0, // Initialize earnings
          rating: 0, // Initialize rating 
          aboutDoctor: result.aboutDoctor,
          profileImage: result.profileImage ? URL.createObjectURL(result.profileImage) : undefined,
          availableDays: result.availableDays, // Add availableDays to the new doctor object
          timeSlot: result.timeSlot, // Add timeSlot to the new doctor object
          email: result.email // Include email
        };
        this.dataSource.data = [...this.dataSource.data, newDoctor]; // Add new doctor to the data source
      }
    });
  }

  deleteDoctor(doctorId: number) {
    const doctor = this.dataSource.data.find(d => d.doctorId === doctorId);
    if (doctor) {
      const dialogRef = this.dialog.open(DoctorDeleteDialogComponent, {
        data: { id: doctorId, name: doctor.doctorName }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Remove the doctor from the data source
          this.dataSource.data = this.dataSource.data.filter(d => d.doctorId !== doctorId);
          
          // Update IDs
          this.updateDoctorIds();
        }
      });
    }
  }
  
  updateDoctorIds() {
    this.dataSource.data = this.dataSource.data.map((doctor, index) => ({
      ...doctor,
      doctorId: index + 1 // Update IDs to be sequential
    }));
  }

  viewDoctor(doctorId: number) {
    const doctor = this.dataSource.data.find(d => d.doctorId === doctorId);
    if (doctor) {
      const dialogRef = this.dialog.open(ViewDoctorDialogComponent, {
        width: '80%',  // Set width to 80% of the viewport
      maxWidth: '500px',  // Maximum width of the dialog
      height: 'auto',  // Height adjusts based on content
        data: { doctor, specialties: this.specialties } // Pass both doctor and specialties data
      });
  
      dialogRef.afterClosed().subscribe(result => {
        // You can handle actions after the dialog is closed if needed
      });
    }
  }

  editDoctor(doctorId: number) {
    const doctor = this.dataSource.data.find(d => d.doctorId === doctorId);
    if (doctor) {
      const dialogRef = this.dialog.open(EditDoctorModalComponent, {
        width: '80%',
        maxWidth: '600px',
        height: 'auto',
        data: { specialties: this.specialties, doctor } // Pass the existing doctor data
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Update the doctor data in the data sourcee
          const index = this.dataSource.data.findIndex(d => d.doctorId === doctorId);
          if (index !== -1) {
            this.dataSource.data[index] = {
              ...doctor,
              doctorName: `${result.firstName} ${result.lastName}`, // Combine first and last name
              specializationId: result.specializationId,
              contactNumber: result.contactNumber,
              fees: result.fees,
              experience: result.experience,
              aboutDoctor: result.aboutDoctor,
              licenseNumber: result.licenseNumber,
              degree: result.degree,
              email: result.email, // Add the email field
              availableDays: result.availableDays, // Add the availableDays field
              timeSlot: result.timeSlot // Add the timeSlot field
              // profileImage can be updated if needed
            };
            this.dataSource.data = [...this.dataSource.data]; // Refresh the data source
          }
        }
      });
    }
  }
}