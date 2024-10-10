import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-about-you-profile',
  templateUrl: './about-you-profile.component.html',
  styleUrl: './about-you-profile.component.scss'
})
export class AboutYouProfileComponent {

  generaleForm: FormGroup;
  bsConfig?: Partial<BsDatepickerConfig>;

  constructor(private fb: NonNullableFormBuilder) {
    this.generaleForm = this.initGeneraleForm();

    this.bsConfig = Object.assign({}, {
      containerClass: 'theme-blue', 
      isAnimated: true,
      showWeekNumbers: false
    });
  }

  private initGeneraleForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required]]
    });
  }

}
