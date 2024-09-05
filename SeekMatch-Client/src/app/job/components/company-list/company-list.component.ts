import { Component } from '@angular/core';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.scss'
})
export class CompanyListComponent {
  companies: any[] = [];

  constructor(private companyService: CompanyService) { }

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.companyService.getCompanies().subscribe((newCompanies) => {
      this.companies = [...this.companies, ...newCompanies];
    });
  }
}
