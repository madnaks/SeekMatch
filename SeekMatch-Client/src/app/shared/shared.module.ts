import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule, NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginModalComponent } from './modals/login-modal/login-modal.component';
import { TalentPreviewModalComponent } from './modals/talent-preview-modal/talent-preview-modal.component';
import { CountryNamePipe } from './pipes/country-name.pipe';
import { GeoNamePipe } from './pipes/geo-name.pipe';
import { EmailInputComponent, ErrorMessageComponent, PasswordInputComponent } from "@app/shared/form-controls";
import { DatePickerInputComponent } from "@app/shared/form-controls/date-picker-input/date-picker-input.component";
import { FooterComponent, HeaderComponent, HeaderSimplifiedComponent, LoginButtonComponent, ToastComponent } from './ui';

@NgModule({
  declarations: [
    HeaderComponent,
    HeaderSimplifiedComponent,
    FooterComponent,
    LoginModalComponent,
    TalentPreviewModalComponent,
    ToastComponent,
    CountryNamePipe,
    GeoNamePipe
  ],
  imports: [
    CommonModule,
    NgbModule,
    NgbToast,
    TranslateModule,
    RouterModule,
    ReactiveFormsModule,
    ErrorMessageComponent,
    EmailInputComponent,
    PasswordInputComponent,
    LoginButtonComponent,
    DatePickerInputComponent
],
  exports: [
    HeaderComponent,
    FooterComponent,
    LoginModalComponent,
    TalentPreviewModalComponent,
    ToastComponent,
    CountryNamePipe,
    GeoNamePipe
  ]
})
export class SharedModule { }
