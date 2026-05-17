import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorMessageComponent } from "../error-message/error-message.component";

@Component({
  selector: 'be-email-input',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, ErrorMessageComponent],
  templateUrl: './email-input.component.html',
  styleUrl: './email-input.component.scss'
})
export class EmailInputComponent {

  @Input({ required: true }) form!: FormGroup;

  public isRequired(): boolean {
    return this.form.get('email')?.hasValidator(Validators.required) ?? false;
  }
}
