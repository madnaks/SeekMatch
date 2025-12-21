import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecruiterRoutingModule } from './recruiter.routing.module';
import { RecruiterProfileComponent } from './recruiter-profile/recruiter-profile.component';
import { AboutYouComponent } from './about-you/about-you.component';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JobOfferComponent } from './job-offer/job-offer.component';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from '../../shared/shared.module';
import { FullNameInputComponent, ErrorMessageComponent, EmailInputComponent } from '@app/shared/form-controls';
import { DatePickerInputComponent } from "@app/shared/form-controls/date-picker-input/date-picker-input.component";
import { NgbAccordionModule, NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap';
import { LoaderComponent } from '@app/shared/ui';
import { JobOfferDetailComponent } from './job-offer-detail/job-offer-detail.component';
import { DeleteJobOfferModalComponent } from './modals/delete-job-offer-modal/delete-job-offer-modal.component';
import { JobOfferPreviewModalComponent } from './modals/job-offer-preview-modal/job-offer-preview-modal.component';
import { JobOfferModalComponent } from './modals/job-offer-modal/job-offer-modal.component';

@NgModule({
  declarations: [
    RecruiterProfileComponent,
    AboutYouComponent,
    JobOfferComponent,
    JobOfferDetailComponent,
    JobOfferModalComponent,
    DeleteJobOfferModalComponent
  ],
  imports: [
    CommonModule,
    RecruiterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    TranslateModule,
    QuillModule.forRoot(),
    SharedModule,
    FullNameInputComponent,
    ErrorMessageComponent,
    EmailInputComponent,
    LoaderComponent,
    DatePickerInputComponent,
    JobOfferPreviewModalComponent,
    NgbAccordionModule,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem,
    NgbDropdownButtonItem
  ]
})
export class RecruiterModule { }
