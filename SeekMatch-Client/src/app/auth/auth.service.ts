import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { delay, Observable, of, tap } from 'rxjs';
import { UserRole } from '../shared/enums/enums';
import { Talent } from '../shared/models/talent';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = 'https://localhost:7216/api/Auth';

  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  register(talent: Talent, userRole: UserRole): Observable<any> {
    // return this.http.post(`${this.apiUrl}/register?userRole=${userRole}`, talent);
    return of({ success: true, message: 'Registration successful!' }).pipe(delay(2000));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  logout(): void {
    localStorage.removeItem('token');
  }

}
