import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { User } from '../model';


const BASE_URL = 'http://localhost:4000/api';  // Base URL for the API

interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrlLogin = `${BASE_URL}/auth/login`;  // Updated login API URL
  private apiUrlRegister = `${BASE_URL}/auth/register/patient`;  // Updated registration API URL
  private forgotPasswordUrl = `${BASE_URL}/auth/forgot-password`;  // New API endpoint for forgot password
  private resetPasswordUrl = `${BASE_URL}/auth/reset-password`;  // New API endpoint for reset password
  private currentUser = new BehaviorSubject<User | null>(null);  // Store the current user's data

  constructor(private http: HttpClient) {}

  // Method to authenticate the user
  authenticate(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, password };

    return this.http.post<any>(this.apiUrlLogin, body, { headers, withCredentials: true }).pipe(
      tap(response => {
        if (response.success) {
          this.setUser(response.user);  // Store the user data
          console.log('User role:', response.user.role.name);  // Debugging/logging user role
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of(error);  // Return the error for handling in the component
      })
    );
  }

  // Method to register a new patient
  registerPatient(
    firstName: string, lastName: string, email: string, dob: string, password: string,
    state: string, city: string, address: string, contactNumber: string, maritalStatus: string,
    bloodGroup: string, gender: string, age: number
  ): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { firstName, lastName, email, dob, password, state, city, address, contactNumber, maritalStatus, bloodGroup, gender, age };

    return this.http.post<any>(this.apiUrlRegister, body, { headers, withCredentials: true }).pipe(
      catchError(error => {
        if (error.status === 400 && error.error.message === 'Email already registered') {
          return of('Email is already registered.');
        }
        return of(error);  // Handle other errors
      })
    );
  }

  // Method to check if the user is logged in
  isLoggedIn(): boolean {
    return this.currentUser.getValue() !== null;  // Returns true if user is logged in
  }

  // Method to get the current user's role as a string
  getUserRole(): string | null {
    return this.currentUser.getValue()?.role?.name || null;  // Return the role if available
  }

  // Method to get the current user's permissions as an array of strings
  getUserPermissions(): string[] {
    return this.currentUser.getValue()?.role?.permissions?.map(permission => permission.name) || [];
  }

  // Method to get the current user object
  getUser(): User | null {
    return this.currentUser.getValue();  // Return the current user
  }

  // Method to set user data after login or registration
  setUser(user: User): void {
    this.currentUser.next(user);  // Set the user data (including role, token, etc.)
  }

  // Method to log out the user
  logout(): Observable<boolean> {
    return this.http.get<{ success: boolean }>(`${BASE_URL}/auth/logout`, { withCredentials: true }).pipe(
      tap(() => {
        // Reset current user state
        this.currentUser.next(null);
      }),
      map(response => response.success),
      catchError(error => {
        console.error('Logout error:', error);
        // Even if logout fails, clear the current user
        this.currentUser.next(null);
        return of(false);
      })
    );
  }

  // Optional: Method to check the session and restore user data if logged in
  checkSession(): Observable<boolean> {
    return this.http.get<any>(`${BASE_URL}/auth/me`, { withCredentials: true }).pipe(
      tap(response => {
        if (response.success) {
          this.setUser(response.user);  // Restore user data
        } else {
          this.logout();  // Log out if no session
        }
      }),
      map(response => response.success),
      catchError(() => {
        this.logout();  // Log out on error
        return of(false);
      })
    );
  }

  // Method for "Forgot Password" functionality
  forgotPassword(email: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email };

    return this.http.post<any>(this.forgotPasswordUrl, body, { headers }).pipe(
      catchError(error => {
        console.error('Forgot password error:', error);
        return of(error);  // Rethrow the error for handling in the component
      })
    );
  }

  // Method for "Reset Password" functionality
  resetPassword(token: string, newPassword: string): Observable<ResetPasswordResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { password: newPassword };

    return this.http.put<ResetPasswordResponse>(`${this.resetPasswordUrl}?token=${token}`, body, { headers }).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Password reset failed');
        }
        return response;
      }),
      catchError(error => {
        console.error('Reset password error:', error);
        return of(error);  // Return the error
      })
    );
  }
}
