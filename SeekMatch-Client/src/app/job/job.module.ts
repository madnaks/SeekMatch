import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompaniesComponent } from './components/companies/companies.component';
import { JobOffersComponent } from './components/job-offers/job-offers.component';
import { JobRoutingModule } from './job-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { JobListComponent } from './components/job-list/job-list.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';

@NgModule({
  declarations: [CompaniesComponent, JobOffersComponent, JobListComponent, JobDetailsComponent],
  imports: [
    CommonModule,
    JobRoutingModule,
    TranslateModule
  ],
  exports: [CompaniesComponent, JobOffersComponent]
})

export class JobModule { }
