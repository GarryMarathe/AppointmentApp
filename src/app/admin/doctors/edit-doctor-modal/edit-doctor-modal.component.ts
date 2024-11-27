import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Doctor, Specialty } from '../../../model';
import { DoctorService } from '../../../services/doctor/doctor.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-edit-doctor-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './edit-doctor-modal.component.html',
  styleUrls: ['./edit-doctor-modal.component.css']
})
export class EditDoctorModalComponent {
  doctorForm!: FormGroup;
  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  isLoading = false;
  specialties: Specialty[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditDoctorModalComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { specialties: Specialty[], doctor: Doctor },  // Receive doctor data
    private snackBar: MatSnackBar,
    private doctorService: DoctorService
  ) {
    this.initializeForm();
    this.patchDoctorData();
    this.fetchSpecialties();
    console.log('Specialties:', this.specialties); // Log specialties here
  }

  // Fetch specialties from backend
  private fetchSpecialties(): void {
    this.doctorService.getAllSpecialties().subscribe({
      next: (response) => {
        this.specialties = response.specialities; // Set the fetched specialties
        this.patchDoctorData();
      },
      error: (error) => {
        console.error('Error fetching specialties:', error);
        this.showErrorMessage(error);
      }
    });
  }
  showErrorMessage(arg0: string) {
    throw new Error('Method not implemented.');
  }
  // Initialize the form
  private initializeForm(): void {
    this.doctorForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      speciality: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      licenseNumber: ['', Validators.required],
      yearsOfExperience: ['', Validators.required],
      degree: ['', Validators.required],
      consultancyFees: ['', Validators.required],
      about: ['', [Validators.maxLength(500)]],
      availabilityDays: [[], Validators.required],
      timeSlot: this.fb.group({
        startTime: ['', [Validators.required, Validators.pattern('^([01]?[0-9]|2[0-3]):[0-5][0-9]$')]],
        endTime: ['', [Validators.required, Validators.pattern('^([01]?[0-9]|2[0-3]):[0-5][0-9]$')]]
      })
    });
  }

  parseAvailability(availabilityData: any) {
    if (!availabilityData || !Array.isArray(availabilityData)) {
      return {
        availabilityDays: [],  // Changed to empty array instead of string
        timeSlot: {
          startTime: '',
          endTime: ''
        }
      };
    }


    try {
      // Assuming timeSlots array exists and is non-empty
      const firstTimeSlot = availabilityData[0]?.timeSlots[0];
      const lastTimeSlot = availabilityData[0]?.timeSlots[availabilityData[0].timeSlots.length - 1];

      return {
        availabilityDays: availabilityData.map(item => item.day),  // Returning as array of days
        timeSlot: {
          startTime: firstTimeSlot ? firstTimeSlot.startTime : '',
          endTime: lastTimeSlot ? lastTimeSlot.endTime : ''
        }
      };
    } catch (error) {
      console.error('Error parsing availability data:', error);
      return {
        availabilityDays: [],  // Empty array
        timeSlot: {
          startTime: '',
          endTime: ''
        }
      };
    }
  }

  private patchDoctorData(): void {
    const doctor = this.data.doctor; // Use the doctor object passed from the parent component
    if (doctor && this.specialties.length > 0) {
      const parsedAvailability = this.parseAvailability(doctor.availability);  // Parse availability data
      console.log(parsedAvailability.timeSlot)
      this.doctorForm.patchValue({
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        speciality: this.specialties.find(specialty => specialty.name === doctor.speciality)?._id || '',
        contactNumber: doctor.contactNumber,
        licenseNumber: doctor.licenseNumber,
        yearsOfExperience: doctor.yearsOfExperience,
        degree: doctor.degree,
        consultancyFees: doctor.consultancyFees,
        about: doctor.about,
        availabilityDays: parsedAvailability.availabilityDays,
        timeSlot: {
          startTime: parsedAvailability.timeSlot.startTime,
          endTime: parsedAvailability.timeSlot.endTime,
        }
      });
    }
  }

  // Submit form data
  onSubmit(): void {
    if (this.doctorForm.invalid) {
      this.snackBar.open('Please fill all required fields correctly.', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    Object.keys(this.doctorForm.value).forEach(key => {
      const value = this.doctorForm.value[key];
      // Check if the key is 'timeSlot' and if it's an object
      if (key === 'timeSlot' && typeof value === 'object' && value !== null) {
        formData.append(key, JSON.stringify(value)); // Convert timeSlot object to JSON string
      }
      // Check if the key is 'availabilityDays' and it's an array
      else if (key === 'availabilityDays' && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value)); // Convert availabilityDays array to comma-separated string
      }
      else {
        formData.append(key, value); // For all other fields, append them as-is
      }
    });

    this.doctorService.updateDoctor(this.data.doctor.id, formData)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.snackBar.open('Doctor updated successfully!', 'Close', { duration: 3000 });
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.log('Error updating doctor:', error);
          this.snackBar.open(error, 'Close', { duration: 3000 });
        }
      });
  }

  // Cancel and close the dialog
  onCancel(): void {
    this.dialogRef.close();
  }
}