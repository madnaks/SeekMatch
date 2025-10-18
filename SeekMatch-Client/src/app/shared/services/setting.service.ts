import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Setting } from '../models/setting';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  private readonly apiUrl = 'https://localhost:7216/api/setting';

  constructor(private http: HttpClient) { }

  loadSetting(): Observable<any> {
    return this.http.get<Setting[]>(`${this.apiUrl}`);
  }

  updateSetting(setting: Setting): Observable<any> {
    return this.http.post(`${this.apiUrl}`, setting);
  }
}
