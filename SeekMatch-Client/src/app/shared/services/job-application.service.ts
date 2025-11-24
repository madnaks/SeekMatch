import { HttpClient, HttpResponse } from '@angular/common/http';
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
    return this.http.post(`${this.apiUrl}/apply/${jobOfferId}`, null);
  }

  expressApply(jobOfferId: string | undefined, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/express-apply/${jobOfferId}`, formData);
  }

  shortList(jobApplicationId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/short-list/${jobApplicationId}`, null);
  }

  interviewScheduled(jobApplicationId: string | undefined, interviewData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/interview-scheduled/${jobApplicationId}`, interviewData);
  }

  hire(jobApplicationId: string | undefined): Observable<any> {
    return this.http.put(`${this.apiUrl}/hire/${jobApplicationId}`, null);
  }

  reject(jobApplicationId: string, rejectionReason: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${jobApplicationId}`, JSON.stringify(rejectionReason), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  downloadCv(jobApplicationId: string): Observable<HttpResponse<Blob>> {
    return this.http.get(
      `${this.apiUrl}/job-applications/${jobApplicationId}/cv`,
      { observe: 'response', responseType: 'blob' }
    );
  }

  delete(jobApplicationId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${jobApplicationId}`);
  }

}
