import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalentRoutingModule } from './talent.routing.module';
import { ExperienceComponent } from './experience/experience.component';
import { EducationModalComponent } from './modals/education-modal/education-modal.component';
import { EducationComponent } from './education/education.component';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JobApplicationsComponent } from './job-application/job-applications.component';
import { SharedModule } from '../../shared/shared.module';
import { NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TalentDashboardComponent } from './talent-dashboard/talent-dashboard.component';
import { TalentProfileComponent } from './talent-profile/talent-profile.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { FullNameInputComponent, PhoneInputComponent, ErrorMessageComponent, EmailInputComponent, DatePickerInputComponent, DataTableComponent, InfoComponent, AddressGroupComponent, TextFloatInputComponent, TextAreaFloatInputComponent } from '@app/shared/form-controls';
import { JobModule } from "@app/job/job.module";
import { ResumeComponent } from './resume/resume.component';
import { BookmarkComponent } from './bookmark/bookmark.component';
import { LoaderComponent } from '@app/shared/ui';
import { ExperienceModalComponent } from './modals/experience-modal/experience-modal.component';
import { EditProfileModalComponent } from './modals/edit-profile-modal/edit-profile-modal.component';
import { ResumeModalComponent } from './modals/resume-modal/resume-modal.component';
import { TalentPreviewModalComponent } from './modals/talent-preview-modal/talent-preview-modal.component';
import { JobOfferPreviewModalComponent } from '../recruiter/modals/job-offer-preview-modal/job-offer-preview-modal.component';

const NgbModules = [
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
  NgbDropdownItem,
  NgbDropdownButtonItem,
  NgbNavModule
];

const FormControls = [
  FullNameInputComponent, 
  PhoneInputComponent, 
  ErrorMessageComponent, 
  EmailInputComponent, 
  DatePickerInputComponent, 
  DataTableComponent, 
  InfoComponent, 
  AddressGroupComponent, 
  TextFloatInputComponent, 
  TextAreaFloatInputComponent
];

@NgModule({
  declarations: [
    TalentDashboardComponent,
    TalentProfileComponent,
    EducationComponent,
    EducationModalComponent,
    ExperienceComponent,
    ExperienceModalComponent,
    JobApplicationsComponent,
    EditProfileModalComponent,
    ResumeComponent,
    ResumeModalComponent,
    BookmarkComponent,
    TalentPreviewModalComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    TalentRoutingModule,
    SharedModule,
    NgxIntlTelInputModule,
    JobModule,
    LoaderComponent,
    JobOfferPreviewModalComponent,
    NgbModules,
    FormControls
  ]
})
export class TalentModule { }