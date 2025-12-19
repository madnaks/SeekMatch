import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutYouComponent } from './about-you/about-you.component';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepresentativeProfileComponent } from './representative-profile/representative-profile.component';
import { RepresentativeRoutingModule } from './representative.routing.module';
import { RecruiterTeamComponent } from './recruiter-team/recruiter-team.component';
import { AddRecruiterTeamModalComponent } from './modals/recruiter-team-modal/recruiter-team-modal.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { FullNameInputComponent, ErrorMessageComponent, EmailInputComponent, PhoneInputComponent } from '@app/shared/form-controls';
import { AddressGroupComponent } from "@app/shared/form-controls/address-group/address-group.component";
import { TextFloatInputComponent } from "@app/shared/form-controls/text-float-input/text-float-input.component";
import { TextAreaFloatInputComponent } from "@app/shared/form-controls/text-area-float-input/text-area-float-input.component";
import { AlertComponent, LoaderComponent } from '@app/shared/ui';
import { DataTableComponent } from "@app/shared/form-controls/data-table/data-table.component";
import { NgbCarouselModule, NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { RecruiterDetailComponent } from './recruiter-detail/recruiter-detail.component';
import { SharedModule } from "@app/shared/shared.module";

@NgModule({
  declarations: [
    RepresentativeProfileComponent,
    AboutYouComponent,
    RecruiterTeamComponent,
    RecruiterDetailComponent,
    AddRecruiterTeamModalComponent,
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
    AddressGroupComponent,
    TextFloatInputComponent,
    TextAreaFloatInputComponent,
    PhoneInputComponent,
    AlertComponent,
    DataTableComponent,
    NgbCarouselModule,
    SharedModule,
    NgbNavModule,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem,
    NgbDropdownButtonItem
  ]
})
export class RepresentativeModule { }
