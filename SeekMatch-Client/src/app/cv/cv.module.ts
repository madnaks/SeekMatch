import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvCreationComponent } from './cv-creation/cv-creation.component';

@NgModule({
  declarations: [CvCreationComponent],
  imports: [
    CommonModule
  ],
  exports: [CvCreationComponent]
})

export class CvModule { }
