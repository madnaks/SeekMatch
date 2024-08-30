import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestComponent } from './test/test.component';
import { TrainingComponent } from './training/training.component';
import { CareerDevelopmentRoutingModule } from './career-development-routing.module';

@NgModule({
  declarations: [TestComponent, TrainingComponent],
  imports: [
    CommonModule,
    CareerDevelopmentRoutingModule
  ],
  exports: [TestComponent, TrainingComponent]
})
export class CareerDevelopmentModule { }
