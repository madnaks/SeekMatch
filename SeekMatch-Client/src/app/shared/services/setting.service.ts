import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Setting } from '../models/setting';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  private readonly apiUrl = `${environment.apiBaseUrl}/setting`;

  constructor(private http: HttpClient) { }

  loadSetting(): Observable<any> {
    return this.http.get<Setting[]>(`${this.apiUrl}`);
  }

  updateSetting(setting: Setting): Observable<any> {
    return this.http.post(`${this.apiUrl}`, setting);
  }
}
