import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Experience } from '../models/experience';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {

  private readonly apiUrl = 'https://localhost:7216/api/Experience';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<Experience[]>(`${this.apiUrl}`);
  }

  create(experience: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, experience);
  }

  update(experience: any): Observable<any> {
    return this.http.put(`${this.apiUrl}`, experience);
  }

  delete(experienceId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${experienceId}`);
  }

}
