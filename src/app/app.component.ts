import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardSidebarComponent } from './components/dashboard-sidebar/dashboard-sidebar.component';
import { AuthService } from './services/auth.service'; // Import AuthService
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, DashboardSidebarComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sidebarOpen = true;
  title: any;

  constructor(private authService: AuthService) {} // Inject AuthService

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn(); // Check if the user is logged in
  }
}