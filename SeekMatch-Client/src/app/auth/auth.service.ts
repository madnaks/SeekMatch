import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = 'http://localhost:5000/api/auth'; // Replace with your API URL

  constructor(private http: HttpClient) { }

}
