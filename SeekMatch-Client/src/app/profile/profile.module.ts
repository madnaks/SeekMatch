import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalentProfileComponent } from './talent-profile/talent-profile.component';
import { ProfileRoutingModule } from './profile.routing.module';
import { AboutYouComponent } from './about-you/about-you.component';
import { EducationComponent } from './education/education.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    TalentProfileComponent,
    AboutYouComponent,
    EducationComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule
  ]
})
export class ProfileModule { }
