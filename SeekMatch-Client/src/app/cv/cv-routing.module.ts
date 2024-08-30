import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CvCreationComponent } from './cv-creation/cv-creation.component';

const routes: Routes = [
  { path: 'cv-creation', component: CvCreationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CvRoutingModule { }
