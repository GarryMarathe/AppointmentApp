    import { Component, inject } from '@angular/core';
    import { MatInputModule } from '@angular/material/input';
    import { MatFormFieldModule } from '@angular/material/form-field';
    import { MatButtonModule } from '@angular/material/button';
    import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
    import { Router, RouterModule } from '@angular/router';
    import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
    import { CommonModule } from '@angular/common';
    import { catchError } from 'rxjs/operators';
    import { of } from 'rxjs';
    import { AuthService } from '../../services/auth.service';

    @Component({
    selector: 'app-login-page',
    standalone: true,
    imports: [
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatSnackBarModule,
        RouterModule,
        ReactiveFormsModule,
        CommonModule
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
    })
    export class LoginPageComponent {
    loginForm!: FormGroup;  // Declare the form group
    errorMessage: string = ''; // Error message for invalid login
    authService = inject(AuthService);

    constructor(private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar) {}

    ngOnInit(): void {
        // Initialize the form
        this.loginForm = this.fb.group({
        email: ['john.doe@example.com', [Validators.required, Validators.email]],  // Email validation
        password: ['password123', [Validators.required, Validators.minLength(6)]]  // Password validation
        });
    }

    // Handle form submission
    onSubmit(): void {
        if (this.loginForm.valid) {
        const { email, password } = this.loginForm.value;

        // Call the authenticate method from AuthService
        this.authService.authenticate(email, password).pipe(
            catchError(err => {
            this.errorMessage = 'Invalid credentials, please try again.';
            this.snackBar.open(this.errorMessage, 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'center',
            });
            return of(null); // Return an observable with null
            })
        ).subscribe(response => {
            if (response && response.success) { // Check if response is successful
            // Save the user data in AuthService
            // console.log(response)
            this.authService.setUser(response.user); // Set the user data (role, token, etc.)

            // Show Snackbar notification for successful login
            this.snackBar.open('Login successful!', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'center',
            });

            // Check the role and route accordingly
            const userRole = this.authService.getUserRole();
            console.log('User Role:', userRole); // Add this line for debugging
            if (userRole === 'admin') {
                this.router.navigate(['/admin/dashboard']);
            } else if (userRole === 'doctor') {
                this.router.navigate(['/doctor/dashboard']);
            } else {
                this.router.navigate(['/login']); // Redirect to login if role is unknown
            }
            }
        });
        } else {
        // Mark the form as touched to show validation errors
        this.loginForm.markAllAsTouched();
        }
    }
    }
