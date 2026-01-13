import { inject, Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ChangePasswordModalComponent } from "../modals/change-password-modal/change-password-modal.component";

export const temporaryPasswordGuard = () => {
  const authService = inject(AuthService);
  const modalService = inject(NgbModal);

  if (!authService.isAuthenticated()) {
    authService.logout();
  } else {
    if (authService.isTemporaryPassword()) {
  
      modalService.open(ChangePasswordModalComponent, { centered: true, backdrop: 'static' });
      
      return false;
    };
  }


  return true;
};
