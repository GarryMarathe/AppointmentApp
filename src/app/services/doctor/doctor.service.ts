import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Doctor, Specialty } from '../../model'



@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = `http://localhost:4000/api/doctors`;

  constructor(private http: HttpClient) { }

  getDoctors(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { withCredentials: true }).pipe(
      map(response => {
        console.log('API Response:', response); // Debug log
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getDoctorById(id: string): Observable<any> {
    console.log(id)
    return this.http.get<any>(`${this.apiUrl}/${id}`, { withCredentials: true }).pipe(
      map(response => {
        console.log('API Response:', response); // Debug log
        return response;
      }),
      catchError(this.handleError)
    );
  }

  addDoctor(doctorData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, doctorData, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  updateDoctor(id: string, doctorData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, doctorData, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  deleteDoctor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  // Fetch all specialities
  getAllSpecialties(): Observable<any> {
    return this.http.get<any>('http://localhost:4000/api/specialities', { withCredentials: true });
  }

  // getSpecialties(): Observable<Specialty[]> {
  //   return this.http.get<Specialty[]>(`${this.apiUrl}/specialties`,{withCredentials:true}).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.error.message));
  }
}
