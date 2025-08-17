import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorMessageComponent } from "../error-message/error-message.component";

@Component({
  selector: 'app-full-name-input',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, ErrorMessageComponent],
  templateUrl: './full-name-input.component.html',
  styleUrl: './full-name-input.component.scss'
})
export class FullNameInputComponent {

  @Input({ required: true }) form!: FormGroup;
}
