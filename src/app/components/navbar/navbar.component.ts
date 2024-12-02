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
  isLogouting = false; // Added to prevent multiple logout attempts

  constructor(private authService: AuthService, private router: Router) {} // Inject Router

  ngOnInit(): void {
    this.username = this.authService.getUserRole(); // Get the current user's role
    this.role = this.authService.getUserRole(); // Get the current user's role
  }

  get welcomeMessage(): string {
    return this.role ? `Welcome ${this.role.charAt(0).toUpperCase() + this.role.slice(1)}!!` : '';
  }

  logout(): void {
    // Prevent multiple logout attempts
    if (this.isLogouting) return;

    this.isLogouting = true;
    this.authService.logout().subscribe({
      next: (success) => {
        this.isLogouting = false;
        // Always navigate to login, regardless of logout success
        this.router.navigate(['/login']);
      },
      error: () => {
        this.isLogouting = false;
        this.router.navigate(['/login']);
      }
    });
  }
}