import { inject, Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LoginModalComponent } from "../modals/login-modal/login-modal.component";
import { ResetPasswordModalComponent } from "../modals/reset-password-modal/reset-password-modal.component";

export const temporaryPasswordGuard = () => {
  const authService = inject(AuthService);
  const modalService = inject(NgbModal);

  if (!authService.isAuthenticated()) {
    authService.logout();
  } else {
    if (authService.isTemporaryPassword()) {
  
      modalService.open(ResetPasswordModalComponent, { centered: true, backdrop: 'static' });
      
      return false;
    };
  }


  return true;
};
