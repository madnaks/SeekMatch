import { Component } from '@angular/core';
import { AbstractControl, FormGroup, NonNullableFormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  selectedRole: string = '';
  signUpForm: FormGroup;

  constructor(private modalService: NgbModal, private fb: NonNullableFormBuilder) {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator() });
  }

  passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const formGroup = control as FormGroup;
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { mismatch: true };
    };
  }
  open(content: any, userRole: string) {
    this.selectedRole = userRole;
    this.modalService.open(content, { centered: true, backdrop: 'static' });
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      console.log('Form Submitted!', this.signUpForm.value);
    } else {
      console.log(this.signUpForm.errors);
      this.signUpForm.markAllAsTouched();
    }
  }
}