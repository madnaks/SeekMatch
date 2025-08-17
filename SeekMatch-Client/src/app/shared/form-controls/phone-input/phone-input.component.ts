import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CountryISO, NgxIntlTelInputModule, SearchCountryField } from 'ngx-intl-tel-input';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
  selector: 'app-phone-input',
  standalone: true,
  imports: [NgxIntlTelInputModule, ReactiveFormsModule, TranslateModule, ErrorMessageComponent],
  templateUrl: './phone-input.component.html',
  styleUrl: './phone-input.component.scss'
})
export class PhoneInputComponent {

  @Input({ required: true }) form!: FormGroup;

  public CountryISO = CountryISO;
  public SearchCountryField = SearchCountryField;
  public selectedCountryISO = CountryISO.Tunisia;

  public onPhoneCountryChange(): void {
    this.form.patchValue({ phone: '' });
  }
}
