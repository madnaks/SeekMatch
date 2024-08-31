import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobOffersComponent } from './components/job-offers/job-offers.component';
import { CompaniesComponent } from './components/companies/companies.component';

const routes: Routes = [
  { path: 'job-offers', component: JobOffersComponent }, // Default path for the JobModule
  { path: 'companies', component: CompaniesComponent } // Route with a parameter for job details
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobRoutingModule { }
