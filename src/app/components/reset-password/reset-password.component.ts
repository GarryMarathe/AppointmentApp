import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    RouterModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  // private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  errorMessage = '';

  resetPasswordForm: FormGroup;
  token: string | null = null;
  loading = false;
  passwordVisible = false;
  confirmPasswordVisible = false;

  constructor() {
    this.resetPasswordForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (!this.token) {
      this.router.navigate(['/login']);
    }
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    return password &&
      confirmPassword &&
      password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid && this.token) {
      this.loading = true;

      this.authService
        .resetPassword(this.token, this.resetPasswordForm.value.password)
        .subscribe({
          next: (response) => {
            this.loading = false;

            this.openSuccessDialog(
              response.message || 'Password reset successfully!'
            );
          },
          error: (error) => {
            this.loading = false;

            this.errorMessage =
              error.error.message ||
              'An error occurred. Please try again later.';
          },
        });
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
  }
  openSuccessDialog(message: string): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: '400px',
      data: { message: message },
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
  // Helper methods for error messages
  getPasswordErrorMessage(): string {
    const passwordControl = this.resetPasswordForm.get('password');
    if (passwordControl?.hasError('required')) return 'Password is required';
    if (passwordControl?.hasError('minlength')) return 'Minimum 8 characters';
    if (passwordControl?.hasError('pattern'))
      return 'Include uppercase, lowercase, number, special char';
    return '';
  }

  getConfirmPasswordErrorMessage(): string {
    if (this.resetPasswordForm.hasError('passwordMismatch'))
      return 'Passwords do not match';
    return '';
  }
}

@Component({
  selector: 'app-success-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatProgressBarModule,
    MatButtonModule,
  ],
  template: `
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
  `,
  styles: [
    `
      .mat-mdc-dialog-content {
        text-align: center;
      }
    `,
  ],
})
export class SuccessDialogComponent {
  countdown = 5;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}
