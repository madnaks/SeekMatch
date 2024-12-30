import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    // path: 'talent', component: TalentProfileComponent,
    // children: [
    //   { path: 'about-you', component: AboutYouComponent },
    //   { path: 'education', component: EducationComponent },
    //   { path: 'experience', component: ExperienceComponent },
    //   { path: '', redirectTo: 'about-you', pathMatch: 'full' }
    // ]
    path: 'talent',
    loadChildren: () => import('./talent/talent.module').then(m => m.TalentModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
