import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { DashboardCard, DashboardService } from '../../services/stats/dashboard-service.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  cards: DashboardCard[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.fetchDashboardStats();
  }

  fetchDashboardStats() {
    this.isLoading = true;
    this.dashboardService.getDashboardStats()
      .pipe(
        catchError(err => {
          this.error = 'Failed to load dashboard statistics';
          this.isLoading = false;
          return of([]); // Return an empty array to prevent error
        })
      )
      .subscribe({
        next: (cards) => {
          this.cards = cards;
          this.isLoading = false;
        }
      });
  }
}