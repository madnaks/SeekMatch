import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutYouComponent } from './about-you/about-you.component';
import { RepresentativeProfileComponent } from './representative-profile/representative-profile.component';
import { RecruiterTeamComponent } from './recruiter-team/recruiter-team.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { SettingsComponent } from '../commun/settings/settings.component';
import { SecurityComponent } from '../commun/security/security.component';
import { RecruiterDetailComponent } from './recruiter-detail/recruiter-detail.component';

const routes: Routes = [
  {
    path: '', component: RepresentativeProfileComponent,
    data: { breadcrumb: 'Profile' },
    children: [
      {
        path: 'about-you',
        component: AboutYouComponent,
        data: { breadcrumb: 'About you' }
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
      { path: '', redirectTo: 'about-you', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepresentativeRoutingModule { }
