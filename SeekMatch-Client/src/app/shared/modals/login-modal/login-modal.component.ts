import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss'
})
export class LoginModalComponent {

    @Input() closeModal: () => void = () => {};
    @Input() dismissModal: (reason: string) => void = () => {};

    passwordVisible : boolean = false;

    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    }

    dismiss(reason: string) {
      if (this.dismissModal) {
        this.dismissModal(reason);
      }
    }

}
