import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalentRoutingModule } from './talent.routing.module';
import { ExperienceModalComponent } from './experience-modal/experience-modal.component';
import { ExperienceComponent } from './experience/experience.component';
import { EducationModalComponent } from './education-modal/education-modal.component';
import { EducationComponent } from './education/education.component';
import { AboutYouComponent } from './about-you/about-you.component';
import { TalentProfileComponent } from './talent-profile/talent-profile.component';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JobApplicationComponent } from './job-application/job-application.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    TalentProfileComponent,
    AboutYouComponent,
    EducationComponent,
    EducationModalComponent,
    ExperienceComponent,
    ExperienceModalComponent,
    JobApplicationComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    TalentRoutingModule,
    SharedModule
  ]
})
export class TalentModule { }
