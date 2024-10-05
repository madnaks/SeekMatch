import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup, NonNullableFormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { JobSeeker } from '../../../shared/models/job-seeker';
import { UserRole } from '../../../shared/enums/enums';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.scss'
})
export class RegisterModalComponent {

  @Input() userRole: UserRole = UserRole.JobSeeker;
  @Input() closeModal: () => void = () => {};
  @Input() dismissModal: (reason: string) => void = () => {};

  // create a variable and assing to it UserRole Enum so that it can be user in html
  UserRole = UserRole;
 
  signUpForm: FormGroup;
  passwordVisible : boolean = false;
  confirmPasswordVisible : boolean = false;

  constructor(
    private fb: NonNullableFormBuilder, 
    private authService: AuthService,
    private router: Router) {
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

  private passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const formGroup = control as FormGroup;
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { mismatch: true };
    };
  }

  public onSubmit(): void {
    if (this.signUpForm.valid) {
      this.register();
    } else {
      this.signUpForm.markAllAsTouched();
    }
  }

  private register(): void {
    const formValues = this.signUpForm.value;

    const jobSeeker = new JobSeeker(
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

  public togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  public toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  public dismiss(reason: string) {
    if (this.dismissModal) {
      this.dismissModal(reason);
    }
  }
}
