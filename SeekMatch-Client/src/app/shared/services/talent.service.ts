import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Talent } from '../models/talent';
import { Bookmark } from '../models/bookmark';

@Injectable({
  providedIn: 'root'
})
export class TalentService {

  private readonly apiUrl = 'https://localhost:7216/api/Talent';

  constructor(private http: HttpClient) { }

  register(talent: Talent): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, talent);
  }

  getById(talentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-by-id/${talentId}`);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-profile`);
  }

  saveProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/save-profile`, profileData);
  }

  uploadProfilePicture(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('profilePicture', file);

    return this.http.post(`${this.apiUrl}/upload-profile-picture`, formData);
  }

  deleteProfilePicture(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-profile-picture`);
  }

  getAllBookmarks(): Observable<any> {
    return this.http.get<Bookmark[]>(`${this.apiUrl}/get-all-bookmarks`);
  }
}
