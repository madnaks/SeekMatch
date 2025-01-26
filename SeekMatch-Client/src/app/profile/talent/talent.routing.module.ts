import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TalentProfileComponent } from './talent-profile/talent-profile.component';
import { AboutYouComponent } from './about-you/about-you.component';
import { EducationComponent } from './education/education.component';
import { ExperienceComponent } from './experience/experience.component';
import { JobApplicationComponent } from './job-application/job-application.component';

const routes: Routes = [
  {
    path: '', component: TalentProfileComponent,
    children: [
      { path: 'about-you', component: AboutYouComponent },
      { path: 'education', component: EducationComponent },
      { path: 'experience', component: ExperienceComponent },
      { path: 'job-application', component: JobApplicationComponent },
      { path: '', redirectTo: 'about-you', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TalentRoutingModule { }
