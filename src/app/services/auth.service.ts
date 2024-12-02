import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { User } from '../model';

const BASE_URL = 'http://localhost:4000/api';

interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${BASE_URL}/auth`;
  private forgotPasswordUrl = `${BASE_URL}/auth/forgot-password`; // New API endpoint for forgot password
  private resetPasswordUrl = `${BASE_URL}/auth/reset-password`; // New API endpoint for reset password
  private currentUser = new BehaviorSubject<User | null>(null);
  private http = inject(HttpClient);

  constructor() {
    // this.checkSession().subscribe(); // Check session on service init
  }

  checkSession(): Observable<boolean> {
    return this.http.get<any>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      tap(response => {
        if (response.success) {
          this.setUser(response.user);
        } else {
          this.logout();
        }
      }),
      map(response => response.success),
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }

  authenticate(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, password };

    return this.http.post<any>(`${this.apiUrl}/login`, body, { headers, withCredentials: true }).pipe(
      tap(response => {
        if (response.success) {
          this.setUser(response.user);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  getUserRole(): string | null {
    const user = this.currentUser.getValue();
    return user?.role?.name || null;
  }

  getUserPermissions(): string[] {
    const user = this.currentUser.getValue();
    return user?.role?.permissions?.map(permission => permission.name) || [];
  }

  isLoggedIn(): boolean {
    return this.currentUser.getValue() !== null;
  }

  // logout(): void {
  //   this.currentUser.next(null);
  // }

  setUser(user: User): void {
    this.currentUser.next(user);
  }

  getUser(): User | null {
    return this.currentUser.getValue();
  }

  // New method for "Forgot Password" functionality
  forgotPassword(email: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email };

    return this.http.post<any>(this.forgotPasswordUrl, body, { headers }).pipe(
      map(response => {
        return response; // Return the response for further processing if needed
      }),
      catchError(error => {
        console.error('Forgot password error:', error);
        throw error; // Rethrow the error for handling in the component
      })
    );
  }

   // Method for "Reset Password" functionality
resetPassword(token: string, newPassword: string): Observable<ResetPasswordResponse> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const body = { password: newPassword };

  return this.http.put<ResetPasswordResponse>(
    `${this.resetPasswordUrl}?token=${token}`, 
    body, 
    { headers }
  ).pipe(
    map(response => {
      if (!response.success) {
        throw new Error(response.message || 'Password reset failed');
      }
      return response;
    }),
    catchError(error => {
      console.error('Reset password error:', error);
      throw error;
    })
  );
}

logout(): Observable<boolean> {
  return this.http.get<{success: boolean}>(
    `${this.apiUrl}/logout`, 
    { 
      withCredentials: true  // Critical for cookie-based token deletion
    }
  ).pipe(
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

}