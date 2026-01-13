import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { createChangePasswordForm } from './change-password-modal.config';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.scss'
})
export class ChangePasswordModalComponent {

  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };

  public resetPasswordForm: FormGroup;
  public isLoading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router) {
    this.resetPasswordForm = createChangePasswordForm(this.fb);
  }

  public onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      this.isLoading = true;
      this.resetPassword();
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
  }

  private resetPassword(): void {
    const formValues = this.resetPasswordForm.value;

    this.authService.resetPassword(formValues.currentPassword, formValues.newPassword).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: () => {
        this.dismissModal('Reset password succed');
        this.toastService.showSuccessMessage('Reset password succed');
        this.authService.logout();
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.toastService.showErrorMessage('Rese
      error: (error) => {
        this.toastService.showErrorMessage('Reset password failed', error);
      }
    });
  }

  public dismiss(reason: string): void {
    if (this.dismissModal) {
      this.dismissModal(reason);
    }
  }

}
