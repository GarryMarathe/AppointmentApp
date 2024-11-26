import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Specialty } from '../../model';

@Injectable({
  providedIn: 'root'
})
export class SpecialtyService {
  loadSpecialities() {
      throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:4000/api/specialities'; // Your API endpoint

  constructor(private http: HttpClient) {}

  // Fetch all specialities
  getAllSpecialties(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { withCredentials: true });
  }

  // Add a new speciality
  addSpecialty(name: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { name }, { withCredentials: true });
  }

  // Update an existing speciality
  updateSpecialty(specialty: Specialty): Observable<Specialty> {
    return this.http.put<Specialty>(`${this.apiUrl}/${specialty._id}`, specialty, { withCredentials: true });
  }

  // Delete a speciality
  deleteSpecialty(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
