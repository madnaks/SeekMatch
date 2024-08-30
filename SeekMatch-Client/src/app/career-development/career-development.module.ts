import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestComponent } from './test/test.component';
import { TrainingComponent } from './training/training.component';

@NgModule({
  declarations: [TestComponent, TrainingComponent],
  imports: [
    CommonModule
  ],
  exports: [TestComponent, TrainingComponent],
})
export class CareerDevelopmentModule { }
