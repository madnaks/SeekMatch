import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalentProfileComponent } from './talent-profile/talent-profile.component';
import { ProfileRoutingModule } from './profile.routing.module';
import { AboutYouProfileComponent } from './about-you-profile/about-you-profile.component';
import { EducationProfileComponent } from './education-profile/education-profile.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    TalentProfileComponent,
    AboutYouProfileComponent,
    EducationProfileComponent
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
