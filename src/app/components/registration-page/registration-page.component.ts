import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDateModule } from '@angular/material/core';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,MatButtonModule,MatFormFieldModule,MatInputModule,MatDatepickerModule,MatIconModule,MatTooltipModule,MatNativeDateModule,RouterModule],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss'
})
export class RegistrationPageComponent {
  registerForm!: FormGroup;  // Declare the form group

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    // Initialize the reactive form with validations
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],  // Validate first name as required
      lastName: ['', Validators.required],   // Validate last name as required
      email: ['', [Validators.required, Validators.email]],  // Validate email format
      dob: ['', Validators.required],  // Validate date of birth as required
      password: ['', [Validators.required, Validators.minLength(6)]],  // Validate password
      confirmPassword: ['', Validators.required],  // Validate confirm password
    }, { 
      validators: this.passwordMatchValidator  // Custom validator to check password match
    });
  }

  // Custom validator to check if password and confirm password match
  passwordMatchValidator(formGroup: FormGroup) {
    const { password, confirmPassword } = formGroup.controls;
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
    } else {
      confirmPassword.setErrors(null);
    }
  }

  // Submit handler
  onSubmit(): void {
    if (this.registerForm.valid) {
      // Handle form submission (e.g., call API to register user)
      console.log(this.registerForm.value);
      // Navigate to login page on successful registration
      this.router.navigate(['/login']);
    } else {
      // Mark all fields as touched to show validation errors
      this.registerForm.markAllAsTouched();
    }
  }
}
