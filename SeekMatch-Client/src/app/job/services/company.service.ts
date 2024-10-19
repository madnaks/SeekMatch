import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Company } from '../../shared/models/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private companiesUrl = 'assets/mock/companies.json';

  constructor(private http: HttpClient) { }

  getCompanies() {
    return this.http.get<Company[]>(this.companiesUrl);
  }
}
