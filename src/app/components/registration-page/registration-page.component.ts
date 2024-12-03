import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDateModule, MatOption, MatOptionModule } from '@angular/material/core';
import { Router, RouterModule } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatIconModule, MatTooltipModule, MatNativeDateModule, RouterModule,MatOption,MatSelectModule],
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.scss'],
  providers: [DatePipe]
})

export class RegistrationPageComponent {
  registerForm!: FormGroup;
  bloodGroups: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Rh+', 'Rh-'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      contactNumber: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      gender: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const { password, confirmPassword } = formGroup.controls;
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
    } else {
      confirmPassword.setErrors(null);
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;

      // Form submit logic remains the same
      console.log('Form Data:', formData);
      formData.dob = this.datePipe.transform(formData.dob, 'dd-mm-yyyy');

      this.authService.registerPatient(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.dob,
        formData.password,
        formData.state,
        formData.city,
        formData.address,
        formData.contactNumber,
        formData.maritalStatus,
        formData.bloodGroup,
        formData.gender,
        formData.age
      ).subscribe({
        next: (response) => {
          if (response.success) {
            // Auto-login after registration
            this.authService.authenticate(formData.email, formData.password)
              .subscribe(loginResponse => {
                if (loginResponse.success) {
                  this.authService.setUser(loginResponse.user);
                  this.router.navigate(['/']);
                }
              });
          }
        },
        error: (error) => {
          console.log('Registration failed:', error);
          this.snackBar.open(error.message || 'Email already registered.', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  
}


