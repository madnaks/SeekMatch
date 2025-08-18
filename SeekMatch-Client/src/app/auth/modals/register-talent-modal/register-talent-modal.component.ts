import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup, NonNullableFormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Talent } from '../../../shared/models/talent';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';
import { TalentService } from '../../../shared/services/talent.service';

@Component({
  selector: 'app-register-talent-modal',
  templateUrl: './register-talent-modal.component.html',
  styleUrl: './register-talent-modal.component.scss'
})
export class RegisterTalentModalComponent {

  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };

  registerForm: FormGroup;
  confirmPasswordVisible: boolean = false;
  isLoading: boolean = false;
  isSuccess: boolean = false;
  isError: boolean = false;

  constructor(
    private fb: NonNullableFormBuilder,
    private talentService: TalentService,
    private router: Router,
    private toastService: ToastService) {
    this.registerForm = this.initregisterForm();
  }

  private initregisterForm(): FormGroup {
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
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.register();
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  private register(): void {
    const formValues = this.registerForm.value;

    let talent = new Talent(formValues);
    
    this.talentService.register(talent).pipe(
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

  public toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  public dismiss(reason: string) {
    if (this.dismissModal) {
      this.dismissModal(reason);
    }
  }
}
