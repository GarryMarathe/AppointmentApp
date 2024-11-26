import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../model';


const BASE_URL = 'http://localhost:4000/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${BASE_URL}/auth/login`; // Your API endpoint for login
  private currentUser: User | null = null; // Store the current user's data

  private http = inject(HttpClient);

  constructor() {}

  // Method to authenticate user
  authenticate(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, password };

    return this.http.post<any>(this.apiUrl, body, { headers, withCredentials: true }).pipe(
      map(response => {
        if (response.success) {
          // console.log(response)
         
        }
        return response; // Return the response for further processing if needed
      }),
      catchError(error => {
        console.error('Login error:', error);
        throw error; // Rethrow the error for handling in the component
      })
    );
  }

  // Method to get the current user's role as a string
  getUserRole(): string | null {
    // console.log(this.currentUser) 
    return this.currentUser && this.currentUser.role ? this.currentUser.role.name : null; // Return the role's name
  }

  // Method to get the current user's permissions (returns as an array of strings)
  getUserPermissions(): string[] {
    const permissions = this.currentUser?.role?.permissions.map(permission => permission.name) || [];
    return permissions; // Return the list of permission names
  }

  // Method to check if the user is logged in
  isLoggedIn(): boolean {
    return this.currentUser !== null; // Returns true if a user is logged in
  }

  // Method to log out the user
  logout(): void {
    this.currentUser = null; // Clear the current user on logout
    console.log('User logged out');
  }

  // Optional method to set user data
  setUser(user: User): void {
    this.currentUser = user; // Set the user data (role, token, etc.)
  }

  // Optional method to get the current user
  getUser(): User | null {
    return this.currentUser;
  }
}
