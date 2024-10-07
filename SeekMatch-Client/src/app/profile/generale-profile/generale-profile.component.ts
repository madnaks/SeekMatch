import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateStruct, NgbInputDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-generale-profile',
  templateUrl: './generale-profile.component.html',
  styleUrl: './generale-profile.component.scss'
})
export class GeneraleProfileComponent {

  model?: NgbDateStruct;
  generaleForm: FormGroup;

  constructor(config: NgbInputDatepickerConfig, calendar: NgbCalendar, private fb: NonNullableFormBuilder) {
    this.initDateConfiguration(config, calendar);

    this.generaleForm = this.initGeneraleForm();
  }

  private initDateConfiguration(config: NgbInputDatepickerConfig, calendar: NgbCalendar):void {
    // customize default values of datepickers used by this component tree
    config.minDate = { year: 1900, month: 1, day: 1 };
    config.maxDate = { year: 2099, month: 12, day: 31 };

    // days that don't belong to current month are not visible
    config.outsideDays = 'hidden';

    // weekends are disabled
    config.markDisabled = (date: NgbDateStruct) => {
      const ngbDate = new NgbDate(date.year, date.month, date.day); // Convert NgbDateStruct to NgbDate
      return calendar.getWeekday(ngbDate) >= 6; // Check if it's a weekend
    };

    // setting datepicker popup to close only on click outside
    config.autoClose = 'outside';

    // setting datepicker popup to open above the input
    config.placement = ['top-start', 'top-end'];
  }

  private initGeneraleForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      model: [null] 
    });
  }


}
