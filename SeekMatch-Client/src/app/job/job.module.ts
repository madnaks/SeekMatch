import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompaniesComponent } from './companies/companies.component';
import { JobOffersComponent } from './job-offers/job-offers.component';
import { JobRoutingModule } from './job-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [CompaniesComponent, JobOffersComponent],
  imports: [
    CommonModule,
    JobRoutingModule,
    TranslateModule
  ],
  exports: [CompaniesComponent, JobOffersComponent]
})

export class JobModule { }
