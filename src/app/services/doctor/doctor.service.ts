import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Doctor, Specialty } from '../../model';



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
    return this.http.get<any>(`${this.apiUrl}/${id}` , { withCredentials: true }).pipe(
      map(response => {
        console.log('API Response:', response); // Debug log
        return response;
      }),
      catchError(this.handleError)
    );
  }

  addDoctor(doctorData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, doctorData,  { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  updateDoctor(id: string, doctorData: FormData): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.apiUrl}/${id}`, doctorData).pipe(
      catchError(this.handleError)
    );
  }

  deleteDoctor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}` , { withCredentials: true }).pipe(
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
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
