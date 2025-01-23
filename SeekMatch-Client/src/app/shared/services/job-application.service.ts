import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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

  apply(jobApplication: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, jobApplication);
  }

  delete(jobApplicationId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${jobApplicationId}`);
  }

}
