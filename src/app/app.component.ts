import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardSidebarComponent } from './components/dashboard-sidebar/dashboard-sidebar.component';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, DashboardSidebarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  sidebarOpen = true;

  constructor(public authService: AuthService) {}
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  ngOnInit() {
    // this.authService.checkSession().subscribe();
  }

 
  isDarkTheme = false;

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.className = this.isDarkTheme ? 'dark-theme' : 'light-theme';
  }
}