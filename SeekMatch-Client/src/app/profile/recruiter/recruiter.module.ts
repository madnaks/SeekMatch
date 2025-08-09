import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecruiterRoutingModule } from './recruiter.routing.module';
import { RecruiterProfileComponent } from './recruiter-profile/recruiter-profile.component';
import { AboutYouComponent } from './about-you/about-you.component';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JobOfferComponent } from './job-offer/job-offer.component';
import { JobOfferModalComponent } from './job-offer-modal/job-offer-modal.component';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from '../../shared/shared.module';
import { FullNameInputComponent } from '@app/shared/form-controls';

@NgModule({
  declarations: [
    RecruiterProfileComponent,
    AboutYouComponent,
    JobOfferComponent,
    JobOfferModalComponent
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
    FullNameInputComponent
  ]
})
export class RecruiterModule { }
