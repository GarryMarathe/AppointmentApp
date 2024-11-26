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
  doctorForm: FormGroup;
  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(
    public dialogRef: MatDialogRef<EditDoctorModalComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { specialties: Specialty[], doctor: Doctor },
    private snackBar: MatSnackBar
  ) {
    this.doctorForm = this.fb.group({
      firstName: [data.doctor.doctorName.split(' ')[0], Validators.required],
      lastName: [data.doctor.doctorName.split(' ')[1], Validators.required],
      email: [data.doctor.email, [Validators.required, Validators.email]], 
      // specializationId: [data.doctor.specializationId, Validators.required],
      contactNumber: [data.doctor.contactNumber, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      licenseNumber: [data.doctor.licenseNumber, Validators.required],
      experience: [data.doctor.yearsOfExperience, [Validators.required, Validators.min(0)]],
      degree: [data.doctor.degree, Validators.required],
      fees: [data.doctor.consultancyFees, [Validators.required, Validators.min(0)]],
      availableDays: [[], Validators.required], // New availableDays field
      timeSlot: ['', [Validators.required, Validators.pattern('^([01]?[0-9]|2[0-3]):[0-5][0-9] - ([01]?[0-9]|2[0-3]):[0-5][0-9]$')]], // New timeSlot field
      aboutDoctor: [data.doctor.about, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.doctorForm.valid) {
      const updatedDoctorData = {
        ...this.doctorForm.value,
        doctorId: this.data.doctor.doctorId // Keep the existing doctorId
      };
      this.dialogRef.close(updatedDoctorData); // Pass the updated data back
      this.snackBar.open('Doctor updated successfully!', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else {
      this.snackBar.open('Please fill all required fields correctly.', 'Close', {
        duration: 3000,
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}