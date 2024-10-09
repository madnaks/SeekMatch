import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-generale-profile',
  templateUrl: './generale-profile.component.html',
  styleUrl: './generale-profile.component.scss'
})
export class GeneraleProfileComponent {

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
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required]]
    });
  }

}
