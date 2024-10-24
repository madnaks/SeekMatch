import { Component, Input } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss'
})
export class LoginModalComponent {

  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };

  passwordVisible: boolean = false;
  loginForm: FormGroup;
  isLoading: boolean = false;

  constructor(private fb: NonNullableFormBuilder, private authService: AuthService) {
    this.loginForm = this.initLoginForm();
  }

  private initLoginForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public onSubmit(): void {
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
        window.location.reload();
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }

  public togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  public dismiss(reason: string): void {
    if (this.dismissModal) {
      this.dismissModal(reason);
    }
  }

}
