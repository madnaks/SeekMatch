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
}
