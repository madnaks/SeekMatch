import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalentRoutingModule } from './talent.routing.module';
import { ExperienceComponent } from './experience/experience.component';
import { EducationModalComponent } from './modals/education-modal/education-modal.component';
import { EducationComponent } from './education/education.component';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JobApplicationComponent } from './job-application/job-application.component';
import { SharedModule } from '../../shared/shared.module';
import { NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TalentDashboardComponent } from './talent-dashboard/talent-dashboard.component';
import { TalentProfileComponent } from './talent-profile/talent-profile.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { FullNameInputComponent, PhoneInputComponent, ErrorMessageComponent, EmailInputComponent } from '@app/shared/form-controls';
import { JobModule } from "@app/job/job.module";
import { DatePickerInputComponent } from "@app/shared/form-controls/date-picker-input/date-picker-input.component";
import { DataTableComponent } from "@app/shared/form-controls/data-table/data-table.component";
import { ResumeComponent } from './resume/resume.component';
import { InfoComponent } from "@app/shared/form-controls/info/info.component";
import { BookmarkComponent } from './bookmark/bookmark.component';
import { JobOfferPreviewModalComponent } from "@app/profile/recruiter/job-offer-preview-modal/job-offer-preview-modal.component";
import { AddressGroupComponent } from "@app/shared/form-controls/address-group/address-group.component";
import { TextFloatInputComponent } from "@app/shared/form-controls/text-float-input/text-float-input.component";
import { TextAreaFloatInputComponent } from "@app/shared/form-controls/text-area-float-input/text-area-float-input.component";
import { LoaderComponent } from '@app/shared/ui';
import { ExperienceModalComponent } from './modals/experience-modal/experience-modal.component';
import { EditProfileModalComponent } from './modals/edit-profile-modal/edit-profile-modal.component';
import { ResumeModalComponent } from './modals/resume-modal/resume-modal.component';

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
    ResumeModalComponent,
    BookmarkComponent
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
    InfoComponent,
    JobOfferPreviewModalComponent,
    AddressGroupComponent,
    TextFloatInputComponent,
    TextAreaFloatInputComponent,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem,
    NgbDropdownButtonItem
  ]
})
export class TalentModule { }