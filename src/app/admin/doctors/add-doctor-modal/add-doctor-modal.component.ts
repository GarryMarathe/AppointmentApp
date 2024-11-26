// add-doctor-modal.component.ts (Updated with RxJS)
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs/operators';
import { DoctorService } from '../../../services/doctor/doctor.service';
import { Specialty } from '../../../model';

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
    MatSnackBarModule,
    MatProgressSpinnerModule
    
  ],
  templateUrl: './add-doctor-modal.component.html',
  styleUrls: ['./add-doctor-modal.component.css']
})
export class AddDoctorModalComponent {
  doctorForm!: FormGroup;
  selectedFile: File | null = null;
  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  isLoading = false;
  specialties: Specialty[] = []; // To store the fetched specialties

  constructor(
    public dialogRef: MatDialogRef<AddDoctorModalComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { specialties: Specialty[] },
    private snackBar: MatSnackBar,
    private doctorService: DoctorService
  ) {
    console.log('Specialties passed:', this.data.specialties); // Debugging log
  }

  ngOnInit(): void {
    this.initializeForm();
    console.log(this.doctorForm); // Now this should log the form structure
    this.fetchSpecialties(); // Fetch specialties when component initializes
    console.log('Specialties:', this.specialties); // Log specialties here
    
    
  }

    // Fetch specialties from backend
    private fetchSpecialties(): void {
      this.doctorService.getAllSpecialties().subscribe({
        next: (response) => {
          console.log(response)
          this.specialties = response.specialities; // Set the fetched specialties
        },
        error: (error) => {
          console.error('Error fetching specialties:', error);
          this.showErrorMessage('Failed to fetch specialties. Please try again.');
        }
      });
    }

    private initializeForm(): void {
      console.log('Initializing form...');  // Debugging log
      this.doctorForm = this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        speciality: ['', Validators.required], 
        contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        licenseNumber: ['', Validators.required],
        yearsOfExperience: ['', [Validators.required, Validators.min(0)]],
        degree: ['', Validators.required],
        consultancyFees: ['', [Validators.required, Validators.min(0)]],
        about: ['', [Validators.maxLength(500)]],
        availabilityDays: [[], Validators.required],
        timeSlot: this.fb.group({
          startTime: ['', [Validators.required, Validators.pattern('^([01]?[0-9]|2[0-3]):[0-5][0-9]$')]],
          endTime: ['', [Validators.required, Validators.pattern('^([01]?[0-9]|2[0-3]):[0-5][0-9]$')]]
        })
      });
      console.log('Form initialized:', this.doctorForm);
    }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.doctorForm.valid && this.selectedFile) {
      this.isLoading = true;
      const formData = this.prepareFormData();
  
      this.doctorService.addDoctor(formData).pipe(finalize(() => this.isLoading = false)).subscribe({
        next: (response) => {
          this.showSuccessMessage('Doctor added successfully!');
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error adding doctor:', error);
          this.showErrorMessage('Error adding doctor. Please try again.');
        }
      });
    } else {
      this.showErrorMessage('Please fill all required fields and upload a profile image.');
    }
  }
  private prepareFormData(): FormData {
    const formData = new FormData();
    formData.append('profileImg', this.selectedFile as File); // Add the selected file

    Object.keys(this.doctorForm.value).forEach(key => {
      const value = this.doctorForm.value[key];
      if (key === 'availableDays' && Array.isArray(value)) {
        formData.append(key, value.join(',')); // If it’s an array, join the days
      } else {
        formData.append(key, value);
      }
    });

    return formData;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}