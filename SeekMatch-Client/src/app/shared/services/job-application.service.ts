import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JobApplication } from '../models/job-application';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {

  private readonly apiUrl = 'https://localhost:7216/api/JobApplication';

  constructor(private http: HttpClient) { }

  getAllByTalent(): Observable<any> {
    return this.http.get<JobApplication[]>(`${this.apiUrl}/get-all-by-talent`);
  }
  
  getAllByRecruiter(): Observable<any> {
    return this.http.get<JobApplication[]>(`${this.apiUrl}/get-all-by-recruiter`);
  }

  apply(jobOfferId: string | undefined): Observable<any> {
    return this.http.post(`${this.apiUrl}/${jobOfferId}`, null);
  }

  reject(jobApplicationId: string, rejectionReason: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${jobApplicationId}`, JSON.stringify(rejectionReason), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  delete(jobApplicationId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${jobApplicationId}`);
  }

}
