import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobOffersComponent } from '../job/components/job-offers/job-offers.component';

const routes: Routes = [
  { path: '', component: JobOffersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
