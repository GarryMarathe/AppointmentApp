import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatButtonModule, 
    RouterModule,
    MatDialogModule,
    MatProgressBarModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  forgotPasswordForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.loading = true;
      const email = this.forgotPasswordForm.value.email;

      this.authService.forgotPassword(email).subscribe({
        next: (response) => {
          this.loading = false;
          this.openSuccessDialog(response.message || 'Password reset email sent successfully!');
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error.message || 'An error occurred. Please try again later.';
        }
      });
    } else {
      this.errorMessage = 'Please enter a valid email address.';
    }
  }

  openSuccessDialog(message: string): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: '400px',
      data: { message: message }
    });

    // Start countdown and redirect
    let countdown = 5;
    const intervalId = setInterval(() => {
      countdown--;
      dialogRef.componentInstance.countdown = countdown;

      if (countdown === 0) {
        clearInterval(intervalId);
        dialogRef.close();
        this.router.navigate(['/login']);
      }
    }, 1000);
  }
}

@Component({
  selector: 'app-success-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatProgressBarModule, 
    MatButtonModule
  ],
  template: `
    <div class="p-4">
      <h2 mat-dialog-title>Success</h2>
      <mat-dialog-content>
        {{ data.message }}
        <p class="mt-2">Redirecting to login in {{ countdown }} seconds...</p>
        <mat-progress-bar 
          mode="determinate" 
          [value]="(5 - countdown) * 20"
          class="mt-2"
        ></mat-progress-bar>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button [mat-dialog-close]="true">Close</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .mat-mdc-dialog-content {
      text-align: center;
    }
  `]
})
export class SuccessDialogComponent {
  countdown = 5;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}