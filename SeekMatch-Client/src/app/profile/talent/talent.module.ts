import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalentRoutingModule } from './talent.routing.module';
import { ExperienceModalComponent } from './experience-modal/experience-modal.component';
import { ExperienceComponent } from './experience/experience.component';
import { EducationModalComponent } from './education-modal/education-modal.component';
import { EducationComponent } from './education/education.component';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JobApplicationComponent } from './job-application/job-application.component';
import { SharedModule } from '../../shared/shared.module';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { EditProfileModalComponent } from './edit-profile-modal/edit-profile-modal.component';
import { TalentDashboardComponent } from './talent-dashboard/talent-dashboard.component';
import { TalentProfileComponent } from './talent-profile/talent-profile.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { CountryNamePipe } from '../../shared/pipes/country-name.pipe';

@NgModule({
  declarations: [
    TalentDashboardComponent,
    TalentProfileComponent,
    EducationComponent,
    EducationModalComponent,
    ExperienceComponent,
    ExperienceModalComponent,
    JobApplicationComponent,
    EditProfileModalComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    TalentRoutingModule,
    SharedModule,
    NgbNavModule,
    NgxIntlTelInputModule
  ]
})
export class TalentModule { }