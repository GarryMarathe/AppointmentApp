import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterLink],
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.css']
})
export class DashboardSidebarComponent implements OnInit {
  @Input() open: boolean = true; // Sidebar open state
  selectedTab: string = '';
  menuItems: any[] = []; // Initialize as an empty array

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Get the role of the user after login
    const role = this.authService.getUserRole(); // Get the role from AuthService

    // Populate menuItems based on the user's role
    if (role === 'admin') {
      this.menuItems = [
        { label: 'Dashboard', icon: 'dashboard', link: '/admin/dashboard' },
        { label: 'Appointments', icon: 'calendar_today', link: '/admin/appointments' },
        { label: 'Specialties', icon: 'category', link: '/admin/specialties' },
        { label: 'Doctors', icon: 'people', link: '/admin/doctors' },
        { label: 'Patients', icon: 'person', link: '/admin/patients' },
      ];
    } else if (role === 'doctor') {
      this.menuItems = [
        { label: 'Doctor Dashboard', icon: 'dashboard', link: '/doctor/dashboard' },
        { label: 'My Appointments', icon: 'calendar_today', link: '/doctor/my-appointments' },
        { label: 'Patients', icon: 'person', link: '/doctor/patients' },
      ];
    }

    // Get the selected tab from query params
    this.route.queryParams.subscribe(params => {
      this.selectedTab = params['selectedTab'] || this.menuItems[0]?.label; // Default to the first item if available
    });
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}
