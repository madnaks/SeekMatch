import { Component, Input, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormGroup, NonNullableFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/shared/services/auth.service';
import { JobApplicationService } from '@app/shared/services/job-application.service';
import { ToastService } from '@app/shared/services/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-express-apply-modal',
  templateUrl: './express-apply-modal.component.html',
  styleUrl: './express-apply-modal.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class ExpressApplyModalComponent {

  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };
  @Input() jobOfferId: string | undefined = '';

  public expressApplyMode: boolean = false;
  public expressApplyLoginSignUpMode: boolean = false;
  public expressApplyForm: FormGroup;
  public isSaving: boolean = false;
  public activeTab: number = 1;
  public loginForm: FormGroup;
  public signupForm: FormGroup;
  public isLoading: boolean = false;

  constructor(
    private fb: NonNullableFormBuilder,
    private jobApplicationService: JobApplicationService,
    private toastService: ToastService,
    private authService: AuthService,
    private router: Router) {
    this.expressApplyForm = this.initForm();
    this.loginForm = this.initLoginForm();
    this.signupForm = this.initSignupForm();
  }

  private initForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      cv: [null, [Validators.required, this.pdfFileValidator]],
      phone: ['']
    });
  }

  private initLoginForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  private initSignupForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  public dismiss(reason: string = '') {
    if (this.dismissModal) {
      this.dismissModal(reason);
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.expressApplyForm.patchValue({ cv: file });
      this.expressApplyForm.get('cv')?.updateValueAndValidity();
    }
  }

  public onSubmit(): void {
    if (this.expressApplyForm.invalid) {
      this.expressApplyForm.markAllAsTouched();
      return;
    }
    this.isSaving = true;

    const expressApplyData = this.expressApplyForm.value;
    const phoneNumberObject = expressApplyData.phone;
    const formattedPhoneNumber = phoneNumberObject?.internationalNumber || '';

    // Build FormData for multipart/form-data
    const formData = new FormData();
    formData.append('firstName', expressApplyData.firstName);
    formData.append('lastName', expressApplyData.lastName);
    formData.append('email', expressApplyData.email);
    formData.append('phone', formattedPhoneNumber);

    if (expressApplyData.cv) {
      formData.append('cv', expressApplyData.cv);
    }

    this.jobApplicationService.expressApply(this.jobOfferId, formData).pipe(
      finalize(() => {
        this.isSaving = false;
      })).subscribe({
        next: () => {
          this.toastService.showSuccessMessage('Applied successfully!');
          this.dismiss();
        },
        error: (error) => {
          this.toastService.showErrorMessage('Error while applying!', error);
          this.dismiss();
        }
      });
  }

  private pdfFileValidator(control: AbstractControl): ValidationErrors | null {
    const file = control.value;
    if (file && file instanceof File) {
      
      if (file.type !== 'application/pdf') {
        return { invalidFileType: true };
      }
    }
    return null;
  }

  public onLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.login();
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  private login(): void {
    const formValues = this.loginForm.value;

    this.authService.login(formValues.email, formValues.password).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: () => {
        this.dismissModal('Login succed');
        this.toastService.showSuccessMessage('Login succed');
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.toastService.showErrorMessage('Login failed', error);
      }
    });
  }

}