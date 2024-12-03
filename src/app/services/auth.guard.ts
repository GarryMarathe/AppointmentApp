import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const currentUrl = route.url.join('/');

    return this.authService.checkSession().pipe(
      map(isAuthenticated => {
        if (isAuthenticated) {
          const role = this.authService.getUserRole();
          
          // Prevent authenticated users from accessing login/register
          if (currentUrl === 'login' || currentUrl === 'register') {
            this.redirectBasedOnRole(role);
            return false;
          }

          // Role-based routing
          return this.handleRoleBasedAccess(role, currentUrl);
        } else {
          // Allow access to public routes when not authenticated
          if (this.isPublicRoute(currentUrl)) {
            return true;
          }
          
          // Redirect to login for protected routes
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }

  private handleRoleBasedAccess(role: string | null, currentUrl: string): boolean {
    switch (role) {
      case 'admin':
        if (currentUrl === '') {
          this.router.navigate(['/admin/dashboard']);
          return false;
        }
        return true;

      case 'doctor':
        if (currentUrl === '') {
          this.router.navigate(['/doctor/dashboard']);
          return false;
        }
        return true;

      case 'patient':
        if (currentUrl === '') {
          return true; // Allow access to landing page
        }
        return true;

      default:
        this.router.navigate(['/login']);
        return false;
    }
  }

  private redirectBasedOnRole(role: string | null): void {
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'doctor':
        this.router.navigate(['/doctor/dashboard']);
        break;
      case 'patient':
      default:
        this.router.navigate(['/']);
        break;
    }
  }

  private isPublicRoute(url: string): boolean {
    const publicRoutes = ['login', 'register', 'forgot-password', 'reset-password'];
    return publicRoutes.includes(url);
  }
}