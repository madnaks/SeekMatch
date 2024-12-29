import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Representative } from '../models/representative';
import { Company } from '../models/company';

@Injectable({
  providedIn: 'root'
})
export class RepresentativeService {

  private readonly apiUrl = 'https://localhost:7216/api/Representative';

  constructor(private http: HttpClient) { }

  register(representative: Representative, company: Company): Observable<any> {
    
    const registerRepresentativeDto = {
      email: representative.email,
      password: representative.password,
      firstName: representative.firstName,
      lastName: representative.lastName,
      position: representative.position,
      companyName: company.name,
      companyAddress: company.address,
      companyPhoneNumber: company.phoneNumber
    };
    
    return this.http.post(`${this.apiUrl}/register`, registerRepresentativeDto);
  }
}
