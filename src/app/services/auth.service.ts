import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { User } from '../model';
import { Router } from '@angular/router';

const BASE_URL = 'http://localhost:4000/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${BASE_URL}/auth`;
  private currentUser = new BehaviorSubject<User | null>(null);
  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() {
    this.checkAuthStatus(); // Check auth status when service is initialized
  }

  // Method to check current authentication status
  checkAuthStatus(): Observable<boolean> {
    return this.http.get<any>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      tap(user => {
        this.currentUser.next(user);
        this.redirectBasedOnRole(user);
      }),
      map(() => true),
      catchError(() => {
        this.currentUser.next(null);
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }

  // Method to authenticate user
  authenticate(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, password };

    return this.http.post<any>(`${this.apiUrl}/login`, body, { headers, withCredentials: true }).pipe(
      tap(response => {
        if (response.success) {
          this.currentUser.next(response.user);
          this.redirectBasedOnRole(response.user);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  private redirectBasedOnRole(user: User): void {
    if (user?.role?.name === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else if (user?.role?.name === 'doctor') {
      this.router.navigate(['/doctor/dashboard']);
    }
  }

  getUserRole(): string | null {
    return this.currentUser.value?.role?.name || null;
  }

  getUserPermissions(): string[] {
    return this.currentUser.value?.role?.permissions.map(permission => permission.name) || [];
  }

  isLoggedIn(): boolean {
    return !!this.currentUser.value;
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.currentUser.next(null);
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        console.error('Logout error:', error);
        return of(null);
      })
    ).subscribe();
  }

  setUser(user: User): void {
    this.currentUser.next(user);
  }

  getUser(): User | null {
    return this.currentUser.value;
  }
}