import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorMessageComponent } from "../error-message/error-message.component";

@Component({
  selector: 'be-text-input',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, ErrorMessageComponent],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss'
})
export class TextInputComponent {

  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) controlName!: string;
  @Input({ required: true }) id!: string;
  @Input() label: string = '';
  @Input() hasIcon: boolean = false;
  @Input() iconClass: string = '';
  @Input() placeholder!: string;
  @Input() errorMessageKey: string = '';

  public getIconClass(): string {
    return this.iconClass + ' me-2';
  }

  public isRequired(): boolean {
    return this.form.get(this.controlName)?.hasValidator(Validators.required) ?? false;
  }
}
