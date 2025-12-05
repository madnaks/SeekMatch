import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutYouComponent } from './about-you/about-you.component';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepresentativeProfileComponent } from './representative-profile/representative-profile.component';
import { RepresentativeRoutingModule } from './representative.routing.module';
import { RecruiterTeamComponent } from './recruiter-team/recruiter-team.component';
import { RecruiterTeamModalComponent } from './recruiter-team-modal/recruiter-team-modal.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { FullNameInputComponent, ErrorMessageComponent, EmailInputComponent, LoaderComponent } from '@app/shared/form-controls';
import { AddressGroupComponent } from "@app/shared/form-controls/address-group/address-group.component";

@NgModule({
  declarations: [
    RepresentativeProfileComponent,
    AboutYouComponent,
    RecruiterTeamComponent,
    RecruiterTeamModalComponent,
    CompanyInfoComponent
  ],
  imports: [
    CommonModule,
    RepresentativeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    TranslateModule,
    FullNameInputComponent,
    ErrorMessageComponent,
    EmailInputComponent,
    LoaderComponent,
    AddressGroupComponent
]
})
export class RepresentativeModule { }
