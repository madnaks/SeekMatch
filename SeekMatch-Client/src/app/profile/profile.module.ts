import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalentProfileComponent } from './talent/talent-profile/talent-profile.component';
import { ProfileRoutingModule } from './profile.routing.module';
import { AboutYouComponent } from './talent/about-you/about-you.component';
import { EducationComponent } from './talent/education/education.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { EducationModalComponent } from './talent/education-modal/education-modal.component';
import { ExperienceComponent } from './talent/experience/experience.component';
import { ExperienceModalComponent } from './talent/experience-modal/experience-modal.component';

@NgModule({
  declarations: [
    TalentProfileComponent,
    AboutYouComponent,
    EducationComponent,
    EducationModalComponent,
    ExperienceComponent,
    ExperienceModalComponent
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
