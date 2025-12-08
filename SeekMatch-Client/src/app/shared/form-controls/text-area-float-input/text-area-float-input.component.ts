import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorMessageComponent } from "../error-message/error-message.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'be-text-area-float-input',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, ErrorMessageComponent, CommonModule],
  templateUrl: './text-area-float-input.component.html',
  styleUrl: './text-area-float-input.component.scss'
})
export class TextAreaFloatInputComponent {

  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) controlName!: string;
  @Input({ required: true }) id!: string;
  @Input() label: string = '';
  @Input() hasIcon: boolean = false;
  @Input() iconClass: string = '';
  @Input() height: string = '100px';
  @Input() placeholder!: string;
  @Input() errorMessageKey: string = '';

  public getIconClass(): string {
    return this.iconClass + ' me-2';
  }
}
