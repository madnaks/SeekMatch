import { Component, Input } from '@angular/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { finalize } from 'rxjs';
import { Recruiter } from '../../../shared/models/recruiter';
import { RecruiterService } from '../../../shared/services/recruiter.service';
import { Representative } from '../../../shared/models/representative';
import { RepresentativeService } from '../../../shared/services/representative.service';
import { Company } from '../../../shared/models/company';
import { LanguageService } from '@app/shared/services/language.service';
import { createRegisterFreelancerForm, createRegisterRepresentativeForm } from './register-recruiter-modal.config';

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
    private toastService: ToastService,
    private languageService: LanguageService) {
    this.registerFreelancerForm = createRegisterFreelancerForm(this.fb);
    this.registerRepresentativeForm = createRegisterRepresentativeForm(this.fb);
  }

  //#region Stepping functions
  public goToNextStep(): void {
    if (this.validateCurrentStep()) {
      this.currentStep++;
      this.updateModalSize();
    }
  }

  public goToPreviousStep(): void {
    this.currentStep--;
    this.updateModalSize();
  }

  private updateModalSize(): void {
    const modalElement = document.querySelector('.modal-dialog');
    if (modalElement) {
      if (this.currentStep === 3 && this.selectedOption === 'company') {
        modalElement.classList.add('modal-xl'); // Add xl size at step 3
      } else {
        modalElement.classList.remove('modal-xl'); // Remove xl size at other steps
      }
    }
  }

  // its here if we need it in the future
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

      recruiter.setting.language = this.languageService.getBrowserLanguageCode();

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

      representative.setting.language = this.languageService.getBrowserLanguageCode();

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
