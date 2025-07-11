import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompaniesComponent } from './components/companies/companies.component';
import { JobOffersComponent } from './components/job-offers/job-offers.component';
import { JobRoutingModule } from './job-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { JobListComponent } from './components/job-list/job-list.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CompaniesComponent, 
    JobOffersComponent, 
    JobListComponent, 
    JobDetailsComponent, 
    CompanyListComponent
  ],
  imports: [
    CommonModule,
    JobRoutingModule,
    NgbAccordionModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [CompaniesComponent, JobOffersComponent]
})

export class JobModule { }
