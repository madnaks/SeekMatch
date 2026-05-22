import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorMessageComponent } from "../error-message/error-message.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'be-text-area-input',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, ErrorMessageComponent, CommonModule],
  templateUrl: './text-area-input.component.html',
  styleUrl: './text-area-input.component.scss'
})
export class TextAreaInputComponent implements OnInit {

  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) controlName!: string;
  @Input({ required: true }) id!: string;
  @Input() label: string = '';
  @Input() hasIcon: boolean = false;
  @Input() iconClass: string = '';
  @Input() height: string = '100px';
  @Input() placeholder!: string;
  @Input() errorMessageKey: string = '';

  ngOnInit(): void {
    this.placeholder = this.placeholder ? this.placeholder : this.label;
  }

  public getIconClass(): string {
    return this.iconClass + ' me-2';
  }

  public isRequired(): boolean {
    return this.form.get(this.controlName)?.hasValidator(Validators.required) ?? false;
  }
}
