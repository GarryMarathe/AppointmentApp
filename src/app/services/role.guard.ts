import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    
    const userRole = this.authService.getUserRole();  // Get the current user's role

    // Check if the user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']); // Redirect to login if not logged in
      return false;
    }

    // Check if the user's role is authorized
    if (next.data['roles'] && next.data['roles'].indexOf(userRole) === -1) {
      this.router.navigate(['/login']); // Redirect to login if role is not authorized
      return false;
    }
    return true;  // Allow access if the role matches
  }
}