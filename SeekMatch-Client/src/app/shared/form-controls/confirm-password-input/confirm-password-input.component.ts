import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorMessageComponent } from "../error-message/error-message.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'be-confirm-password-input',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, ErrorMessageComponent, CommonModule],
  templateUrl: './confirm-password-input.component.html',
  styleUrl: './confirm-password-input.component.scss'
})
export class ConfirmPasswordInputComponent {

  @Input({ required: true }) form!: FormGroup;
  @Input() controlName: string = 'confirmPassword';
  @Input() label: string = 'SHARED.FORM-CONTROLS.LABEL.CONFIRM-PASSWORD';

  public confirmPasswordVisible: boolean = false;

  public togglePasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }
}
