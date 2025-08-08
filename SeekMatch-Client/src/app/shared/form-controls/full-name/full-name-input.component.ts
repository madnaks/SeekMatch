import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CountryISO, NgxIntlTelInputModule, SearchCountryField } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-full-name-input',
  standalone: true,
  imports: [NgxIntlTelInputModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './full-name-input.component.html',
  styleUrl: './full-name-input.component.scss'
})
export class FullNameInputComponent {

  @Input({ required: true }) form!: FormGroup;

  public onPhoneCountryChange(): void {
    // this.profileForm.patchValue({ phone: '' });
  }
}
