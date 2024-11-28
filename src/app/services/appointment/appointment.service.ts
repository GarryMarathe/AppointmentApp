import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `http://localhost:4000/api/appointments`;  // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { withCredentials: true }).pipe(
      catchError(this.handleError)

    );
  }

  getAppointmentsById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }
  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message || 'Something went wrong'));
  }

  
}
