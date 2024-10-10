import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TalentProfileComponent } from './talent-profile/talent-profile.component';
import { AboutYouProfileComponent } from './about-you-profile/about-you-profile.component';
import { EducationProfileComponent } from './education-profile/education-profile.component';

const routes: Routes = [
  {
    path: 'talent', component: TalentProfileComponent,
    children: [
      { path: 'about-you', component: AboutYouProfileComponent },
      { path: 'education', component: EducationProfileComponent },
      { path: '', redirectTo: 'about-you', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
