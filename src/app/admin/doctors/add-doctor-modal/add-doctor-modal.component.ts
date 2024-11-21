import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Specialty } from '../../specialities/specialities.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-doctor-modal',
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
  templateUrl: './add-doctor-modal.component.html',
  styleUrls: ['./add-doctor-modal.component.css']
})
export class AddDoctorModalComponent {
  doctorForm: FormGroup;
  selectedFile: File | null = null;
  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(
    public dialogRef: MatDialogRef<AddDoctorModalComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { specialties: Specialty[] },
    private snackBar: MatSnackBar
  ) {
    this.doctorForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], 
      specializationId: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      licenseNumber: ['', Validators.required],
      experience: ['', [Validators.required, Validators.min(0)]],
      degree: ['', Validators.required],
      fees: ['', [Validators.required, Validators.min(0)]],
      aboutDoctor: [''],
      availableDays: [[], Validators.required],
      timeSlot: ['', [Validators.required, Validators.pattern('^([01]?[0-9]|2[0-3]):[0-5][0-9] - ([01]?[0-9]|2[0-3]):[0-5][0-9]$')]] // Add pattern validator here
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.doctorForm.valid) {
      const formData = {
        ...this.doctorForm.value,
        profileImage: this.selectedFile
      };
      this.dialogRef.close(formData);
      this.snackBar.open('Doctor added successfully!', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    } else {
      this.snackBar.open('Please fill all required fields correctly.', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}