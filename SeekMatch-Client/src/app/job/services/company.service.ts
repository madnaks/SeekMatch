import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Company } from '../company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private companiesUrl = 'assets/mock/companies.json';

  constructor(private http: HttpClient) { }

  getCompanies() {
    return this.http.get<Company[]>(this.companiesUrl);
    // API Call :return this.http.get<any[]>(`/api/jobs?page=${page}`);
  }
}
