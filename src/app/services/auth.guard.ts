import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

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
            // Only redirect if on login page
            if (currentUrl === 'login') {
              if (role === 'admin') {
                this.router.navigate(['/admin/dashboard']);
              } else if (role === 'doctor') {
                this.router.navigate(['/doctor/dashboard']);
              }
            }
            return true;
          } else {
            this.router.navigate(['/login']);
            return false;
          }
        })
      );
    }
  }