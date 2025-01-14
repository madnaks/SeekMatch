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
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    TalentRoutingModule
  ]
})
export class TalentModule { }
