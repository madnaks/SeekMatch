import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutYouComponent } from './about-you/about-you.component';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepresentativeProfileComponent } from './representative-profile/representative-profile.component';
import { RepresentativeRoutingModule } from './representative.routing.module';

@NgModule({
  declarations: [
    RepresentativeProfileComponent,
    AboutYouComponent
  ],
  imports: [
    CommonModule,
    RepresentativeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    TranslateModule
  ]
})
export class RepresentativeModule { }
