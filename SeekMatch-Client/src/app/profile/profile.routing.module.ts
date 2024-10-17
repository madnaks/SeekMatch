import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TalentProfileComponent } from './talent-profile/talent-profile.component';
import { AboutYouComponent } from './about-you/about-you.component';
import { EducationComponent } from './education/education.component';

const routes: Routes = [
  {
    path: 'talent', component: TalentProfileComponent,
    children: [
      { path: 'about-you', component: AboutYouComponent },
      { path: 'education', component: EducationComponent },
      { path: '', redirectTo: 'about-you', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
