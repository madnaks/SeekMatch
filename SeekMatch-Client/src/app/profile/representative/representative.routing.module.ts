import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RepresentativeProfileComponent } from './representative-profile/representative-profile.component';
import { RepresentativeDashboardComponent } from './representative-dashboard/representative-dashboard.component';
import { RecruiterTeamComponent } from './recruiter-team/recruiter-team.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { SettingsComponent } from '../commun/settings/settings.component';
import { SecurityComponent } from '../commun/security/security.component';
import { RecruiterDetailComponent } from './recruiter-detail/recruiter-detail.component';

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
        data: { breadcrumb: 'Company iFnfo' }
      },
      {
        path: 'recruiter-team',
        component: RecruiterTeamComponent,
        data: { breadcrumb: 'Recruiter Team' },
      },
      {
        path: 'recruiter-team/details/:id',
        component: RecruiterDetailComponent,
        data: { breadcrumb: 'Detail' },

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
