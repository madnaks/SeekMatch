import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepresentativeProfileComponent } from './representative-profile/representative-profile.component';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepresentativeRoutingModule } from './representative.routing.module';
import { RecruiterTeamComponent } from './recruiter-team/recruiter-team.component';
import { AddRecruiterTeamModalComponent } from './modals/recruiter-team-modal/recruiter-team-modal.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { FullNameInputComponent, ErrorMessageComponent, EmailInputComponent, PhoneInputComponent, AddressGroupComponent, TextFloatInputComponent, TextAreaFloatInputComponent } from '@app/shared/form-controls';
import { AlertComponent, LoaderComponent } from '@app/shared/ui';
import { DataTableComponent } from "@app/shared/form-controls/data-table/data-table.component";
import { NgbCarouselModule, NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { RecruiterDetailsComponent } from './recruiter-details/recruiter-details.component';
import { SharedModule } from "@app/shared/shared.module";
import { RepresentativeDashboardComponent } from './representative-dashboard/representative-dashboard.component';
import { RecruiterModule } from '../recruiter/recruiter.module';

const NgbModules = [
  NgbNavModule,
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
  NgbDropdownItem,
  NgbCarouselModule,
  NgbDropdownButtonItem
];

const FormControls = [
  FullNameInputComponent,
  ErrorMessageComponent,
  EmailInputComponent,
  PhoneInputComponent,
  AddressGroupComponent,
  TextFloatInputComponent,
  TextAreaFloatInputComponent
];

@NgModule({
  declarations: [
    RepresentativeDashboardComponent,
    RepresentativeProfileComponent,
    RecruiterTeamComponent,
    RecruiterDetailsComponent,
    AddRecruiterTeamModalComponent,
    CompanyInfoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RepresentativeRoutingModule,
    RecruiterModule,
    BsDatepickerModule,
    TranslateModule,
    LoaderComponent,
    AlertComponent,
    DataTableComponent,
    FormControls,
    NgbModules
  ]
})
export class RepresentativeModule { }
