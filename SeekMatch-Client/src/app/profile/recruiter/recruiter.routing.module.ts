import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecruiterProfileComponent } from './recruiter-profile/recruiter-profile.component';
import { AboutYouComponent } from './about-you/about-you.component';

const routes: Routes = [
  {
    path: '', component: RecruiterProfileComponent,
    children: [
      { path: 'about-you', component: AboutYouComponent },
      { path: '', redirectTo: 'about-you', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecruiterRoutingModule { }