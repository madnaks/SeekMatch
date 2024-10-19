import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Education } from '../models/education';

@Injectable({
  providedIn: 'root'
})
export class EducationService {

  private readonly apiUrl = 'https://localhost:7216/api/Education';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<Education[]>(`${this.apiUrl}`);
  }

  create(education: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, education);
  }

}
