import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Import MatSnackBar

@Component({
    selector: 'app-login-page',
    standalone: true,
    imports: [MatInputModule, MatFormFieldModule, MatButtonModule, RouterModule, ReactiveFormsModule, CommonModule, MatSnackBarModule], // Include MatSnackBarModule
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginPageComponent {
    loginForm !: FormGroup;  // Declare the form group
    errorMessage: string = ''; // Error message for invalid login

    constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private snackBar: MatSnackBar) {}

    ngOnInit(): void {
        // Initialize the form
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],  // Email validation
            password: ['', [Validators.required, Validators.minLength(6)]]  // Password validation
        });
    }

    // Handle form submission
    onSubmit(): void {
        if (this.loginForm.valid) {
            const { email, password } = this.loginForm.value;

            // Call the authenticate method from AuthService
            const role = this.authService.authenticate(email, password);

            if (role) {
                // Show Snackbar notification for successful login
                this.snackBar.open('Login successful!', 'Close', {
                    duration: 3000, // Duration in milliseconds
                    verticalPosition: 'top', // Positioning of the Snackbar
                    horizontalPosition: 'center', // Positioning of the Snackbar
                });

                // Pass the selected tab based on role
                const selectedTab = role === 'admin' ? 'Dashboard' : 'Doctor Dashboard';
                this.router.navigate([`/${role}/dashboard`], { queryParams: { selectedTab } });
            } else {
                // Handle invalid login
                this.errorMessage = 'Invalid credentials, please try again.';
                this.loginForm.reset(); // Optionally reset the form
            }
        } else {
            // Mark the form as touched to show validation errors
            this.loginForm.markAllAsTouched();
        }
    }

    // Handle logout
    logout(): void {
        this.authService.logout(); // Call the logout method from AuthService

        // Show Snackbar notification for successful logout
        this.snackBar.open('Logout successful!', 'Close', {
            duration: 3000, // Duration in milliseconds
            verticalPosition: 'top', // Positioning of the Snackbar
            horizontalPosition: 'center', // Positioning of the Snackbar
        });

        this.router.navigate(['/login']); // Navigate back to login page or wherever appropriate
    }
}