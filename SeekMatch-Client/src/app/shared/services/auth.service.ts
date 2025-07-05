import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, tap } from 'rxjs';
import { UserRole } from '../enums/enums';
import { Talent } from '../models/talent';
import { Recruiter } from '../models/recruiter';

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
        localStorage.setItem('role', response.role);
      })
    );
  }

  register(talent: Talent | Recruiter, userRole: UserRole): Observable<any> {
    return this.http.post(`${this.apiUrl}/register?userRole=${userRole}`, talent);
    // return of({ success: true, message: 'Registration successful!' }).pipe(delay(2000));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): UserRole | null {
    const role = localStorage.getItem('role');
    
    if (!role) {
      return null;
    }
  
    const roleNumber = parseInt(role, 4);
    if (roleNumber in UserRole) {
      return roleNumber as UserRole;
    }
  
    return null; 
  }

  /** Only Talent and vistor can apply */
  canApply(): boolean {
    const currentUserRole = this.getUserRole();
    return currentUserRole == UserRole.Talent || currentUserRole == null;
  }
  

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

}
