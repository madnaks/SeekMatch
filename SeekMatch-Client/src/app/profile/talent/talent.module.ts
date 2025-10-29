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
import { FullNameInputComponent, PhoneInputComponent, ErrorMessageComponent, EmailInputComponent, LoaderComponent } from '@app/shared/form-controls';
import { JobModule } from "@app/job/job.module";
import { DatePickerInputComponent } from "@app/shared/form-controls/date-picker-input/date-picker-input.component";
import { DataTableComponent } from "@app/shared/form-controls/data-table/data-table.component";
import { ResumeComponent } from './resume/resume.component';
import { ResumeModalComponent } from './resume-modal/resume-modal.component';
import { InfoComponent } from "@app/shared/form-controls/info/info.component";

@NgModule({
  declarations: [
    TalentDashboardComponent,
    TalentProfileComponent,
    EducationComponent,
    EducationModalComponent,
    ExperienceComponent,
    ExperienceModalComponent,
    JobApplicationComponent,
    EditProfileModalComponent,
    ResumeComponent,
    ResumeModalComponent
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
    NgxIntlTelInputModule,
    FullNameInputComponent,
    PhoneInputComponent,
    ErrorMessageComponent,
    EmailInputComponent,
    JobModule,
    LoaderComponent,
    DatePickerInputComponent,
    DataTableComponent,
    InfoComponent
]
})
export class TalentModule { }