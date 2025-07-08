import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { JobOffer } from '../models/job-offer';

@Injectable({
  providedIn: 'root'
})
export class JobOfferService {

  private selectedJobOffer = new BehaviorSubject<any>(null);
  private readonly apiUrl = 'https://localhost:7216/api/JobOffer';

  selectedJobOffer$ = this.selectedJobOffer.asObservable();

  constructor(private http: HttpClient) { }

  // getAll(): Observable<any> {
  //   return this.http.get<JobOffer[]>(`${this.apiUrl}/get-all`);
  // }

  getAll(filters?: any): Observable<JobOffer[]> {
  let params = new HttpParams();

  debugger

  if (filters) {
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });
  }

  return this.http.get<JobOffer[]>(`${this.apiUrl}/get-all`, { params });
}

  
  getAllByRecruiter(): Observable<any> {
    return this.http.get<JobOffer[]>(`${this.apiUrl}/get-all-by-recruiter`);
  }

  create(jobOffer: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, jobOffer);
  }

  update(jobOffer: any): Observable<any> {
    return this.http.put(`${this.apiUrl}`, jobOffer);
  }

  delete(jobOfferId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${jobOfferId}`);
  }

  setSelectedJobOffer(jobOffer: JobOffer) {
    this.selectedJobOffer.next(jobOffer);
  }

}
