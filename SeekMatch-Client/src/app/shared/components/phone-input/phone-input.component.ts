import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CountryISO, NgxIntlTelInputModule, SearchCountryField } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-phone-input',
  standalone: true,
  imports: [NgxIntlTelInputModule, ReactiveFormsModule],
  templateUrl: './phone-input.component.html',
  styleUrl: './phone-input.component.scss'
})
export class PhoneInputComponent {

  @Input({ required: true }) form!: FormGroup;
  @Input({required: true}) name: string = ''; 

  public CountryISO = CountryISO;
  public SearchCountryField = SearchCountryField;
  public selectedCountryISO = CountryISO.Tunisia;

  public onPhoneCountryChange(): void {
    // this.profileForm.patchValue({ phone: '' });
  }
}
