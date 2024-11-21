import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  cards = [
    { value: 168, label: 'Doctors', iconClass: 'fa fa-user-md', iconColor: 'text-primary', progress: 50, progressColor: 'bg-primary' },
    { value: 487, label: 'Patients', iconClass: 'fa fa-procedures', iconColor: 'text-success', progress: 70, progressColor: 'bg-success' },
    { value: 485, label: 'Appointments', iconClass: 'fa fa-calendar-check', iconColor: 'text-danger', progress: 60, progressColor: 'bg-danger' },
    { value: 62523, label: 'Revenue', iconClass: 'fa fa-folder-open', iconColor: 'text-warning', progress: 80, progressColor: 'bg-warning' },
  ];
}