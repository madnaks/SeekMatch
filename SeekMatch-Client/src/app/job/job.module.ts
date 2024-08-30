import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompaniesComponent } from './companies/companies.component';
import { JobOffersComponent } from './job-offers/job-offers.component';

@NgModule({
  declarations: [CompaniesComponent, JobOffersComponent],
  imports: [
    CommonModule
  ],
  exports: [CompaniesComponent, JobOffersComponent]
})

export class JobModule { }
