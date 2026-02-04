import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecruiterProfileComponent } from './recruiter-profile/recruiter-profile.component';
import { AboutYouComponent } from './about-you/about-you.component';
import { JobOfferComponent } from './job-offer/job-offer.component';
import { SettingsComponent } from '../commun/settings/settings.component';
import { SecurityComponent } from '../commun/security/security.component';
import { JobOfferDetailsComponent } from './job-offer-details/job-offer-details.component';
import { CompanyJobOfferComponent } from './company-job-offer/company-job-offer.component';

const routes: Routes = [
  {
    path: '', component: RecruiterProfileComponent,
    children: [
      { path: 'about-you', component: AboutYouComponent },
      { path: 'job-offer', component: JobOfferComponent },
      { path: 'job-offer/details/:id', component: JobOfferDetailsComponent },
      { path: 'company-job-offer', component: CompanyJobOfferComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'security', component: SecurityComponent },
      { path: '', redirectTo: 'about-you', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecruiterRoutingModule { }
