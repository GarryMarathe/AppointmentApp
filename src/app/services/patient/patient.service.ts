import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Patient } from '../../model';  // Update path if needed

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:4000/api/patients';  // Update with correct API URL

  constructor(private http: HttpClient) {}

  getPatients(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  getPatientById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  addPatient(patientData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, patientData, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message || 'Something went wrong'));
  }
}
