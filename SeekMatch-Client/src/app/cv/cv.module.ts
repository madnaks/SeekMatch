import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvCreationComponent } from './cv-creation/cv-creation.component';
import { CvRoutingModule } from './cv-routing.module';

@NgModule({
  declarations: [CvCreationComponent],
  imports: [
    CommonModule,
    CvRoutingModule
  ],
  exports: [CvCreationComponent]
})

export class CvModule { }
