import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RepresentativeProfileComponent } from './representative-profile/representative-profile.component';
import { RepresentativeDashboardComponent } from './representative-dashboard/representative-dashboard.component';
import { RecruiterTeamComponent } from './recruiter-team/recruiter-team.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { SettingsComponent } from '../commun/settings/settings.component';
import { SecurityComponent } from '../commun/security/security.component';
import { RecruiterDetailsComponent } from './recruiter-details/recruiter-details.component';
import { CompanyJobOfferComponent } from '../recruiter/company-job-offer/company-job-offer.component';
import { JobOfferDetailsComponent } from '../recruiter/job-offer-details/job-offer-details.component';

const routes: Routes = [
  {
    path: '', component: RepresentativeDashboardComponent,
    data: { breadcrumb: 'Dashboard' },
    children: [
      {
        path: 'representative-profile',
        component: RepresentativeProfileComponent,
        data: { breadcrumb: 'Profile' }
      },
      {
        path: 'company-info',
        component: CompanyInfoComponent,
        data: { breadcrumb: 'Company info' }
      },
      {
        path: 'company-job-offer',
        component: CompanyJobOfferComponent,
        data: { breadcrumb: 'Company job offers' }
      },
      {
        path: 'job-offer/details/:id',
        component: JobOfferDetailsComponent
      },
      {
        path: 'recruiter-team',
        component: RecruiterTeamComponent,
        data: { breadcrumb: 'Recruiter Team' },
      },
      {
        path: 'recruiter-team/details/:id',
        component: RecruiterDetailsComponent,
        data: { breadcrumb: 'Details' },
      },
      {
        path: 'settings',
        component: SettingsComponent,
        data: { breadcrumb: 'Settings' }
      },
      {
        path: 'security',
        component: SecurityComponent,
        data: { breadcrumb: 'Security' }
      },
      { path: '', redirectTo: 'representative-profile', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepresentativeRoutingModule { }
