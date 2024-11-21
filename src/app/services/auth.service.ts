import { Injectable } from '@angular/core';

interface User {
  username: string;  // You might want to change this to 'email' if you're using email for login
  password: string;  // In a real application, do not store passwords in plain text
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Sample user credentials
  private users: User[] = [
    { username: 'admin@example.com', password: 'admin123', role: 'admin' },
    { username: 'doctor@example.com', password: 'doctor123', role: 'doctor' }
  ];

  private currentRole: string | null = null; // Store the current user's role

  constructor() {}

  // Method to authenticate user
  authenticate(username: string, password: string): string | null {
    const user = this.users.find(u => u.username === username && u.password === password);
    this.currentRole = user ? user.role : null; // Set current role on successful login
    return this.currentRole;  // Return the role or null if authentication fails
  }

  // Method to get the current user's role
  getUserRole(): string | null {
    return this.currentRole; // Return the current role
  }

  // Method to check if the user is logged in
  isLoggedIn(): boolean {
    return this.currentRole !== null; // Returns true if a user is logged in
  }

  // Method to log out the user
  logout(): void {
    this.currentRole = null; // Clear the current role on logout
  }
}