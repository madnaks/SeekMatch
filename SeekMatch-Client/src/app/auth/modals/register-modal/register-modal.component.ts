import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup, NonNullableFormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Talent } from '../../../shared/models/talent';
import { UserRole } from '../../../shared/enums/enums';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.scss'
})
export class RegisterModalComponent {

  @Input() userRole: UserRole = UserRole.Talent;
  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };

  // create a variable and assing to it UserRole Enum so that it can be user in html
  UserRole = UserRole;

  signupForm: FormGroup;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  isLoading: boolean = false;
  isSuccess: boolean = false;
  isError: boolean = false;

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router) {
    this.signupForm = this.initSignupForm();
    // This code is for later, when implmenting recruiter
    // if (this.userRole == UserRole.Recruiter) {
    //   this.signUpForm.addControl('companyName',this.fb.control('', Validators.required))
    // }
  }

  private initSignupForm(): FormGroup {
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
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.register();
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  private register(): void {
    const formValues = this.signupForm.value;

    let talent = new Talent(formValues);
    
    this.authService.register(talent, UserRole.Talent).pipe(
      finalize(() => {
        this.isLoading = false;
      })).subscribe({
        next: () => {
          this.router.navigate(['/home']);
          this.isSuccess = true;
        },
        error: (error) => {
          console.error('Register failed', error);
          this.isError = true;
        }
      })
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
