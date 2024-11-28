import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { User } from '../model';

const BASE_URL = 'http://localhost:4000/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${BASE_URL}/auth`;
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

  logout(): void {
    this.currentUser.next(null);
  }

  setUser(user: User): void {
    this.currentUser.next(user);
  }

  getUser(): User | null {
    return this.currentUser.getValue();
  }
}