import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Talent } from '../../../shared/models/talent';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';
import { TalentService } from '../../../shared/services/talent.service';
import { LanguageService } from '@app/shared/services/language.service';
import { createRegisterForm } from './register-talent-modal.config';

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
    private fb: FormBuilder,
    private talentService: TalentService,
    private router: Router,
    private toastService: ToastService,
    private languageService: LanguageService) {
    this.registerForm = createRegisterForm(this.fb);
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

    talent.setting.language = this.languageService.getBrowserLanguageCode();
    
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

  public dismiss(reason: string) {
    if (this.dismissModal) {
      this.dismissModal(reason);
    }
  }
}
