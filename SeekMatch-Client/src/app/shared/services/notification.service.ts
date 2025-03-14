import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly apiUrl = 'https://localhost:7216/api/notifications';

  constructor(private http: HttpClient) { }

  getUserNotifications(): Observable<any> {
    return this.http.get<Notification[]>(`${this.apiUrl}`);
  }

}
