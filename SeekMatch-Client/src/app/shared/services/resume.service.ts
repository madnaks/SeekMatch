import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resume } from '../models/resume';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  private readonly apiUrl = 'https://localhost:7216/api/Resume';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<Resume[]>(`${this.apiUrl}`);
  }

  downloadResume(resumeId: string): Observable<HttpResponse<Blob>> {
    return this.http.get(
      `${this.apiUrl}/download/${resumeId}`,
      { observe: 'response', responseType: 'blob' }
    );
  }

  create(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formData);
  }

  update(resume: any): Observable<any> {
    return this.http.put(`${this.apiUrl}`, resume);
  }

  delete(resumeId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${resumeId}`);
  }

}
