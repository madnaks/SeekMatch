import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'be-date-picker-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    BsDatepickerModule
  ],
  templateUrl: './date-picker-input.component.html',
  styleUrls: ['./date-picker-input.component.scss']
})
export class DatePickerInputComponent {

  @Input({ required: true }) form!: FormGroup;
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() controlName: string = '';
  @Input() placeholder: string = '';
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() disabled: boolean = false;
  @Input() date?: Date | null;


  bsConfig?: Partial<BsDatepickerConfig>;

  constructor() {
    this.configureDatePicker();
  }

  private configureDatePicker(): void {
    this.bsConfig = Object.assign({}, {
      containerClass: 'theme-dark-blue',
      dateInputFormat: 'YYYY-MM-DD',
      isAnimated: true,
      showWeekNumbers: false,
    });
  }
}
