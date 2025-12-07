import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorMessageComponent } from "../error-message/error-message.component";

@Component({
  selector: 'be-text-float-input',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, ErrorMessageComponent],
  templateUrl: './text-float-input.component.html',
  styleUrl: './text-float-input.component.scss'
})
export class TextFloatInputComponent {

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
}
