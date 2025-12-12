import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './ui/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule, NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { HeaderSimplifiedComponent } from './ui/header-simplified/header-simplified.component';
import { LoginModalComponent } from './modals/login-modal/login-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastComponent } from './ui/toast/toast.component';
import { FooterComponent } from './ui/footer/footer.component';
import { TalentPreviewModalComponent } from './modals/talent-preview-modal/talent-preview-modal.component';
import { CountryNamePipe } from './pipes/country-name.pipe';
import { GeoNamePipe } from './pipes/geo-name.pipe';
import { EmailInputComponent, ErrorMessageComponent, PasswordInputComponent } from "@app/shared/form-controls";
import { DatePickerInputComponent } from "@app/shared/form-controls/date-picker-input/date-picker-input.component";
import { LoginButtonComponent } from './ui/buttons';

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
    HeaderSimplifiedComponent,
    FooterComponent,
    LoginModalComponent,
    TalentPreviewModalComponent,
    ToastComponent,
    CountryNamePipe,
    GeoNamePipe
  ]
})
export class SharedModule { }
