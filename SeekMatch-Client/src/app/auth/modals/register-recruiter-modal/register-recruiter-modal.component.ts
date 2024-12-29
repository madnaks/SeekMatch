import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup, NonNullableFormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { finalize } from 'rxjs';
import { Recruiter } from '../../../shared/models/recruiter';
import { RecruiterService } from '../../../shared/services/recruiter.service';
import { Representative } from '../../../shared/models/representative';
import { RepresentativeService } from '../../../shared/services/representative.service';
import { Company } from '../../../shared/models/company';

@Component({
  selector: 'app-register-recruiter-modal',
  templateUrl: './register-recruiter-modal.component.html',
  styleUrl: './register-recruiter-modal.component.scss'
})
export class RegisterRecruiterModalComponent {
  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };

  //#region  Stepping variables
  currentStep: number = 1;
  maxSteps: number = 3;
  selectedOption: string | null = null;
  //#endregion

  //#region Forms variables
  registerFreelancerForm: FormGroup;
  registerRepresentativeForm: FormGroup;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  //#endregion


  isLoading: boolean = false;
  isSuccess: boolean = false;
  isError: boolean = false;

  constructor(
    private fb: NonNullableFormBuilder,
    private recruiterService: RecruiterService,
    private representativeService: RepresentativeService,
    private router: Router,
    private toastService: ToastService) {
    this.registerFreelancerForm = this.initRegisterFreelancerForm();
    this.registerRepresentativeForm = this.initRegisterRepresentativeForm();
  }

  //#region Forms functions
  private initRegisterFreelancerForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator() });
  }

  private initRegisterRepresentativeForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      position: ['', Validators.required],
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

  public togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  public toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }
  //#endregion

  //#region Stepping functions
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

  public selectOption(option: string): void {
    this.selectedOption = option;
  }
  //#endregion

  public onSubmit(): void {
    // Validate Freelancer Form
    if (this.selectedOption === 'freelancer') {
      if (this.registerFreelancerForm.valid) {
        this.isLoading = true;
        this.register();
      } else {
        this.registerFreelancerForm.markAllAsTouched();
      }
    } 
    
    // Validate Company Form
    else if (this.selectedOption === 'company') {
      if (this.registerRepresentativeForm.valid) {
        this.isLoading = true;
        this.register();
      } else {
        this.registerRepresentativeForm.markAllAsTouched();
      }
    }
  }

  private register(): void {
    if (this.selectedOption === 'freelancer') {
      const formFreelancerValues = this.registerFreelancerForm.value;

      let recruiter = new Recruiter(formFreelancerValues);

      this.recruiterService.register(recruiter).pipe(
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
        });
    }
    else if (this.selectedOption === 'company') {
      const formRepresentativeValues = this.registerRepresentativeForm.value;

      let representative = new Representative(formRepresentativeValues);
      let company = new Company(formRepresentativeValues);

      this.representativeService.register(representative, company).pipe(
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
        });
    }
  }

  public dismiss(reason: string) {
    if (this.dismissModal) {
      this.dismissModal(reason);
    }
  }
}
