import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, tap } from 'rxjs';
import { UserRole } from '../enums/enums';
import { Talent } from '../models/talent';
import { Recruiter } from '../models/recruiter';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = 'https://localhost:7216/api/Auth';

  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private translate: TranslateService) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('isTemporaryPassword', response.isTemporaryPassword);
        this.translate.use(response.language || 'fr');
      })
    );
  }

  resetPassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { currentPassword, newPassword });
  }

  register(talent: Talent | Recruiter, userRole: UserRole): Observable<any> {
    return this.http.post(`${this.apiUrl}/register?userRole=${userRole}`, talent);
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

  isTemporaryPassword(): boolean {
    const isTemporaryPassword = localStorage.getItem('isTemporaryPassword');

    if (!isTemporaryPassword) {
      return false;
    }
    return isTemporaryPassword === 'true';
  }

  logout(): void {
    localStorage.clear();
  }

}
