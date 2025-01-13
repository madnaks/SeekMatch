import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutYouComponent } from './about-you/about-you.component';
import { RepresentativeProfileComponent } from './representative-profile/representative-profile.component';
import { RecruiterTeamComponent } from './recruiter-team/recruiter-team.component';
import { CompanyInfoComponent } from './company-info/company-info.component';

const routes: Routes = [
  {
    path: '', component: RepresentativeProfileComponent,
    children: [
      { path: 'about-you', component: AboutYouComponent },
      { path: 'company-info', component: CompanyInfoComponent },
      { path: 'recruiter-team', component: RecruiterTeamComponent },
      { path: '', redirectTo: 'about-you', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepresentativeRoutingModule { }
