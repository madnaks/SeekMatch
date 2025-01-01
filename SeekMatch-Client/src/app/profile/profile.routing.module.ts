import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'talent',
    loadChildren: () => import('./talent/talent.module').then(m => m.TalentModule)
  },
  {
    path: 'recruiter',
    loadChildren: () => import('./recruiter/recruiter.module').then(m => m.RecruiterModule)
  },
  {
    path: 'representative',
    loadChildren: () => import('./representative/representative.module').then(m => m.RepresentativeModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
