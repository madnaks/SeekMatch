import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EducationComponent } from './education/education.component';
import { ExperienceComponent } from './experience/experience.component';
import { JobApplicationComponent } from './job-application/job-application.component';
import { TalentDashboardComponent } from './talent-dashboard/talent-dashboard.component';
import { TalentProfileComponent } from './talent-profile/talent-profile.component';
import { SettingsComponent } from '../commun/settings/settings.component';
import { SavedJobsComponent } from './saved-jobs/saved-jobs.component';
import { SecurityComponent } from '../commun/security/security.component';

const routes: Routes = [
  {
    path: '', component: TalentDashboardComponent,
    children: [
      { path: 'talent-profile', component: TalentProfileComponent },
      { path: 'education', component: EducationComponent },
      { path: 'experience', component: ExperienceComponent },
      { path: 'job-application', component: JobApplicationComponent },
      { path: 'saved-jobs', component: SavedJobsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'security', component: SecurityComponent },
      { path: '', redirectTo: 'talent-profile', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TalentRoutingModule { }
