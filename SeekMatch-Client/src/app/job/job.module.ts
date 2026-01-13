import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobOffersComponent } from './components/job-offers/job-offers.component';
import { JobRoutingModule } from './job-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { JobListComponent } from './components/job-list/job-list.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { NgbAccordionModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExpressApplyModalComponent } from './components/express-apply-modal/express-apply-modal.component';
import { PhoneInputComponent, FullNameInputComponent, EmailInputComponent, ErrorMessageComponent, PasswordInputComponent } from "@app/shared/form-controls";
import { SharedModule } from "@app/shared/shared.module";
import { LoaderComponent, LoginButtonComponent } from '@app/shared/ui';

@NgModule({
  declarations: [
    JobOffersComponent,
    JobListComponent,
    JobDetailsComponent,
    ExpressApplyModalComponent
  ],
  imports: [
    CommonModule,
    JobRoutingModule,
    NgbAccordionModule,
    NgbNavModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    PhoneInputComponent,
    FullNameInputComponent,
    EmailInputComponent,
    ErrorMessageComponent,
    LoaderComponent,
    PasswordInputComponent,
    SharedModule,
    LoginButtonComponent
  ]
})

export class JobModule { }
