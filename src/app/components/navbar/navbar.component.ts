import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  username: string | null = null;
  role: string | null = null;

  constructor(private authService: AuthService, private router: Router) {} // Inject Router

  ngOnInit(): void {
    this.username = this.authService.getUserRole(); // Get the current user's role
    this.role = this.authService.getUserRole(); // Get the current user's role
  }

  get welcomeMessage(): string {
    return this.role ? `Welcome ${this.role.charAt(0).toUpperCase() + this.role.slice(1)}!!` : '';
  }

  // Logout method
  logout(): void {
    this.authService.logout(); // Call logout method from AuthService
    this.router.navigate(['/login']); // Redirect to login page
  }
}