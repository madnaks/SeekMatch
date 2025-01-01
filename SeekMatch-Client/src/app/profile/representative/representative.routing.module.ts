import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutYouComponent } from './about-you/about-you.component';
import { RepresentativeProfileComponent } from './recruiter-profile/representative-profile.component';

const routes: Routes = [
  {
    path: '', component: RepresentativeProfileComponent,
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
export class RepresentativeRoutingModule { }
