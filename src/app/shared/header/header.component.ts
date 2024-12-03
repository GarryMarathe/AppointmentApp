import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, CommonModule,MatMenu,RouterLinkActive,MatMenuTrigger],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  userRole: string | null = null;
  userAvatar: string | null = null;
  showHeader: boolean = true;

  constructor(private router: Router, private authService: AuthService) {
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Show header only for public routes and patient role
      this.showHeader = this.shouldShowHeader(event.url);
    });
  }

  ngOnInit(): void {
    this.checkUserStatus();
  }

  private shouldShowHeader(url: string): boolean {
    const userRole = this.authService.getUserRole();
    
    // Show header for public routes and patient role
    if (!this.isLoggedIn || userRole === 'patient') {
      return true;
    }
    
    // Hide header for admin and doctor dashboards
    return !url.includes('/admin') && !url.includes('/doctor');
  }

  checkUserStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userRole = this.authService.getUserRole();
      this.userAvatar = this.authService.getUser()?.avatar || 'https://www.w3schools.com/w3images/avatar2.png';
      this.showHeader = this.shouldShowHeader(this.router.url);
    }
  }

  onRegisterLoginClick(): void {
    this.router.navigate(['/landing']);
  }

  onLogoutClick(): void {
    this.authService.logout().subscribe(() => {
      this.checkUserStatus();
      this.router.navigate(['/landing']);
    });
  }
}