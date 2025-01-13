import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Representative } from '../models/representative';
import { Company } from '../models/company';

@Injectable({
  providedIn: 'root'
})
export class RepresentativeService {

  private readonly apiUrl = 'https://localhost:7216/api/Representative';

  constructor(private http: HttpClient) { }

  register(representative: Representative, company: Company): Observable<any> {
    
    const registerRepresentativeDto = {
      email: representative.email,
      password: representative.password,
      firstName: representative.firstName,
      lastName: representative.lastName,
      position: representative.position,
      companyName: company.name,
      companyAddress: company.address,
      companyPhoneNumber: company.phoneNumber
    };
    
    return this.http.post(`${this.apiUrl}/register`, registerRepresentativeDto);
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

  getRecruiters(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-all-recruiters`);
  }

  createRecruiter(recruiter: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-recruiter`, recruiter);
  }

  updateRecruiter(recruiter: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-recruiter`, recruiter);
  }
}
