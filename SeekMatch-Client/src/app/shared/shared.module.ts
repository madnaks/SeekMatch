import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule, NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginModalComponent } from './modals/login-modal/login-modal.component';
import { CountryNamePipe } from './pipes/country-name.pipe';
import { GeoNamePipe } from './pipes/geo-name.pipe';
import { EmailInputComponent, ErrorMessageComponent, PasswordInputComponent, ConfirmPasswordInputComponent } from "@app/shared/form-controls";
import { DatePickerInputComponent } from "@app/shared/form-controls/date-picker-input/date-picker-input.component";
import { FooterComponent, HeaderComponent, HeaderSimplifiedComponent, LoginButtonComponent, ToastComponent } from './ui';
import { BreadCrumbComponent } from './ui/breadcrumb/breadcrumb.component';
import { SanitizedHtmlPipe } from './pipes/sanitizedHtml.pipe';
import { StepperComponent } from './ui/stepper/stepper.component';
import { ResetPasswordModalComponent } from './modals/reset-password-modal/reset-password-modal.component';

@NgModule({
  declarations: [
    HeaderComponent,
    HeaderSimplifiedComponent,
    FooterComponent,
    LoginModalComponent,
    ResetPasswordModalComponent,
    ToastComponent,
    CountryNamePipe,
    GeoNamePipe,
    SanitizedHtmlPipe,
    BreadCrumbComponent,
    StepperComponent
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
    DatePickerInputComponent,
    ConfirmPasswordInputComponent
],
  exports: [
    HeaderComponent,
    FooterComponent,
    LoginModalComponent,
    ToastComponent,
    CountryNamePipe,
    GeoNamePipe,
    SanitizedHtmlPipe,
    BreadCrumbComponent,
    StepperComponent
  ]
})
export class SharedModule { }
