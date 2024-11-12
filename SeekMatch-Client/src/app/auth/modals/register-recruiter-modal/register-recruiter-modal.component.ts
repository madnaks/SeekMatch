import { Component, Input } from '@angular/core';
import { UserRole } from '../../../shared/enums/enums';
import { AbstractControl, FormGroup, NonNullableFormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { Talent } from '../../../shared/models/talent';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register-recruiter-modal',
  templateUrl: './register-recruiter-modal.component.html',
  styleUrl: './register-recruiter-modal.component.scss'
})
export class RegisterRecruiterModalComponent {
  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };

  currentStep: number = 1;
  maxSteps: number = 4;

  selectedOption: string | null = null;

  registerFreelancerForm: FormGroup;
  registerCompanyForm: FormGroup;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  isLoading: boolean = false;
  isSuccess: boolean = false;
  isError: boolean = false;

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService) {
    this.registerFreelancerForm = this.initRegisterFreelancerForm();
    this.registerCompanyForm = this.fb.group({});
  }

  private initRegisterFreelancerForm(): FormGroup {
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

  public goToNextStep(): void {
    if (this.validateCurrentStep()) {
      this.currentStep++;
    }
  }
  
  public goToPreviousStep(): void {
    this.currentStep--;
  }
  
  private validateCurrentStep(): boolean {
    return true;
  }

  public onSubmit(): void {
    if (this.registerFreelancerForm.valid) {
      this.isLoading = true;
      this.register();
    } else {
      this.registerFreelancerForm.markAllAsTouched();
    }
  }

  private register(): void {
    const formValues = this.registerFreelancerForm.value;

    let talent = new Talent(formValues);

    this.authService.register(talent, UserRole.Recruiter).pipe(
      finalize(() => {
        this.isLoading = false;
      })).subscribe({
        next: () => {
          this.router.navigate(['/home']);
          this.isSuccess = true;
          this.toastService.showSuccessMessage('Register account succeeded');
        },
        error: (error) => {
          this.toastService.showErrorMessage('Register failed', error);
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

  public selectOption(option: string): void {
    this.selectedOption = option;
  }

  public dismiss(reason: string) {
    if (this.dismissModal) {
      this.dismissModal(reason);
    }
  }
}
