import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-generale-profile',
  templateUrl: './generale-profile.component.html',
  styleUrl: './generale-profile.component.scss'
})
export class GeneraleProfileComponent {

  generaleForm: FormGroup;

  constructor( private fb: NonNullableFormBuilder) {
    this.generaleForm = this.initGeneraleForm();
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
