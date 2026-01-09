import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorMessageComponent } from "../error-message/error-message.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'be-password-input',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, ErrorMessageComponent, CommonModule],
  templateUrl: './password-input.component.html',
  styleUrl: './password-input.component.scss'
})
export class PasswordInputComponent implements OnInit {
 

  @Input({ required: true }) form!: FormGroup;
  @Input() controlName: string = 'password';
  @Input() label: string = 'SHARED.FORM-CONTROLS.LABEL.PASSWORD';

  public id!: string;

  public passwordVisible: boolean = false;

  ngOnInit(): void {
    this.id = 'input-' + this.controlName;
  }

  public togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }


}
