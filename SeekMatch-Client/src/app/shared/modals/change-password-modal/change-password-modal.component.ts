import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { createChangePasswordForm } from './change-password-modal.config';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.scss'
})
export class ChangePasswordModalComponent {

  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };

  public changePasswordForm: FormGroup;
  public isLoading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private activeModal: NgbActiveModal) {
    this.changePasswordForm = createChangePasswordForm(this.fb);
  }

  public onSubmit(): void {
    if (this.changePasswordForm.valid) {
      this.isLoading = true;
      this.changePassword();
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }

  private changePassword(): void {
    const formValues = this.changePasswordForm.value;

    this.authService.changePassword(formValues.currentPassword, formValues.newPassword).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: () => {
        this.activeModal.close();
        this.toastService.showSuccessMessage('Change password succed');
        this.authService.logout();
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.toastService.showErrorMessage('Change password failed', error);
      }
    });
  }

}
