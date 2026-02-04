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

  getAll(filters?: any): Observable<JobOffer[]> {
    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get<JobOffer[]>(`${this.apiUrl}/get-all`, { params });
  }

  getById = (id: string): Observable<JobOffer> =>
     this.http.get<JobOffer>(`${this.apiUrl}/get-by-id/${id}`);

  getAllByRecruiter = (): Observable<any> =>
    this.http.get<JobOffer[]>(`${this.apiUrl}/get-all-by-recruiter`);

  getAllByCompany = (): Observable<any> =>
    this.http.get<JobOffer[]>(`${this.apiUrl}/get-all-by-company`);

  create = (jobOffer: any): Observable<any> =>
    this.http.post(`${this.apiUrl}`, jobOffer);

  update = (jobOffer: any): Observable<any> =>
    this.http.put(`${this.apiUrl}`, jobOffer);

  delete = (jobOfferId: string): Observable<any> =>
    this.http.delete(`${this.apiUrl}/${jobOfferId}`);

  setSelectedJobOffer = (jobOffer: JobOffer) =>
    this.selectedJobOffer.next(jobOffer);

  isBookmarked = (jobOfferId: string): Observable<boolean> =>
    this.http.get<boolean>(`${this.apiUrl}/is-bookmarked/${jobOfferId}`);

  bookmark = (jobOfferId: string): Observable<any> =>
    this.http.post(`${this.apiUrl}/bookmark/${jobOfferId}`, null);

  unbookmark = (jobOfferId: string): Observable<any> =>
    this.http.post(`${this.apiUrl}/unbookmark/${jobOfferId}`, null);
}
