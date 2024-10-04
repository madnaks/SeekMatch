import { Component } from '@angular/core';
import { AbstractControl, FormGroup, NonNullableFormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { JobSeeker } from '../../../shared/models/job-seeker';
import { UserRole } from '../../../shared/enums/enums';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  selectedRole: string = '';
  passwordVisible : boolean = false;
  confirmPasswordVisible : boolean = false;
  signUpForm: FormGroup;

  constructor(private modalService: NgbModal, private fb: NonNullableFormBuilder, private authService: AuthService, private router: Router) {
    this.signUpForm = this.initSignUpForm();
  }

  private initSignUpForm(): FormGroup {
    return this.fb.group({
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
      this.register();
    } else {
      this.signUpForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  private register(): void {
    const formValues = this.signUpForm.value;

    const jobSeeker = new JobSeeker (
      formValues.firstName,
      formValues.lastName,
      formValues.email,
      formValues.password
    );

    this.authService.register(jobSeeker, UserRole.JobSeeker).subscribe(
      () => {
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Register failed', error);
      }
    );

  }
}