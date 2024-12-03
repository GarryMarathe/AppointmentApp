import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface DashboardStats {
  totalDoctors: number;
  avgFees: number;
  avgRating: number;
  totalPatients: number;
  totalAppointments: number;
  totalRevenue: number;
}

export interface DashboardCard {
  value: number;
  label: string;
  iconClass: string;
  iconColor: string;
  progress: number;
  progressColor: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:4000/api/admin/stats';

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardCard[]> {
    return this.http.get<{success: boolean, stats: DashboardStats}>(this.apiUrl, {withCredentials: true}).pipe(
      map(response => {
        if (!response.success) {
          throw new Error('Failed to fetch dashboard stats');
        }

        const stats = response.stats;
        return [
          {
            value: stats.totalDoctors,
            label: 'Doctors',
            iconClass: 'fa fa-user-md',
            iconColor: 'text-primary',
            progress: this.calculateProgress(stats.totalDoctors, 10), // Example progress calculation
            progressColor: 'bg-primary'
          },
          {
            value: stats.totalPatients,
            label: 'Patients',
            iconClass: 'fa fa-procedures',
            iconColor: 'text-success',
            progress: this.calculateProgress(stats.totalPatients, 20),
            progressColor: 'bg-success'
          },
          {
            value: stats.totalAppointments,
            label: 'Appointments',
            iconClass: 'fa fa-calendar-check',
            iconColor: 'text-danger',
            progress: this.calculateProgress(stats.totalAppointments, 15),
            progressColor: 'bg-danger'
          },
          {
            value: Math.round(stats.totalRevenue),
            label: 'Revenue',
            iconClass: 'fa fa-folder-open',
            iconColor: 'text-warning',
            progress: this.calculateProgress(stats.totalRevenue, 5000),
            progressColor: 'bg-warning'
          }
        ];
      })
    );
  }

  private calculateProgress(value: number, maxValue: number): number {
    // Simple progress calculation - adjust as needed
    return Math.min(Math.round((value / maxValue) * 100), 100);
  }
}