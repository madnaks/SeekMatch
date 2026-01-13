import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobOffersComponent } from './components/job-offers/job-offers.component';

const routes: Routes = [
  { path: '', component: JobOffersComponent }, // Default path for the JobModule
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobRoutingModule { }
