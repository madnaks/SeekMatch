import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Experience } from '../models/experience';
import { JobOffer } from '../models/job-offer';

@Injectable({
  providedIn: 'root'
})
export class JobOfferService {

  private readonly apiUrl = 'https://localhost:7216/api/JobOffer';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<JobOffer[]>(`${this.apiUrl}`);
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

}
