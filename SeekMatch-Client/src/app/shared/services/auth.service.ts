import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, tap } from 'rxjs';
import { UserRole } from '../enums/enums';
import { Talent } from '../models/talent';
import { Recruiter } from '../models/recruiter';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = 'https://localhost:7216/api/Auth';

  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private translate: TranslateService, private router: Router, private languageService: LanguageService) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        this.router.navigate(['/']);
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('isTemporaryPassword', response.isTemporaryPassword);
        this.translate.use(response.language || this.languageService.getBrowserLanguageCode());
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, { currentPassword, newPassword });
  }

  register(talent: Talent | Recruiter, userRole: UserRole): Observable<any> {
    return this.http.post(`${this.apiUrl}/register?userRole=${userRole}`, talent);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): UserRole | null {
    const role = localStorage.getItem('role');

    if (!role) 
      return null;

    const roleNumber = parseInt(role, 10);
    if (roleNumber in UserRole)
      return roleNumber as UserRole;

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
  
  /**
   * Checks if the current user's password is a temporary password.
   * 
   * This method retrieves the value of 'isTemporaryPassword' from local storage
   * and returns true if it is set to 'true', indicating that the user is using
   * a temporary password. If the value is not found or is not 'true', it returns
   * false.
   * 
   * @returns {boolean} - Returns true if the password is temporary, otherwise false.
   */
  public isTemporaryPassword(): boolean {
    const isTemporaryPassword = localStorage.getItem('isTemporaryPassword');

    if (!isTemporaryPassword) 
      return false;

    return isTemporaryPassword === 'true';
  }

  public logout(): void {
    localStorage.clear();
  }

}
