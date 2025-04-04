import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recruiter } from '../models/recruiter';

@Injectable({
  providedIn: 'root'
})
export class RecruiterService {

  private readonly apiUrl = 'https://localhost:7216/api/Recruiter';

  constructor(private http: HttpClient) { }

  register(recruiter: Recruiter): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, recruiter);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  saveAboutYouData(aboutYouData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/about-you`, aboutYouData);
  }

  uploadProfilePicture(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('profilePicture', file);

    return this.http.post(`${this.apiUrl}/upload-profile-picture`, formData);
  }

  deleteProfilePicture(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-profile-picture`);
  }
}
