import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TalentProfileComponent } from './talent-profile/talent-profile.component';
import { GeneraleProfileComponent } from './generale-profile/generale-profile.component';
import { StudyProfileComponent } from './study-profile/study-profile.component';

const routes: Routes = [
  {
    path: 'talent', component: TalentProfileComponent,
    children: [
      { path: 'general', component: GeneraleProfileComponent },
      { path: 'study', component: StudyProfileComponent },
      { path: '', redirectTo: 'general', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
