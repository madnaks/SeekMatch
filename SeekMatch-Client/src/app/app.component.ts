import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './shared/services/auth.service';
import { ChangePasswordModalComponent } from './shared/modals/change-password-modal/change-password-modal.component';
import { LanguageService } from './shared/services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HomeModule,
    RouterOutlet,
    SharedModule,
    TranslateModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  public isHomePage: boolean = true;

  private modalOpen = false;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private auth: AuthService,
    private modal: NgbModal,
    private languageService: LanguageService) {

    translate.setDefaultLang(this.languageService.getBrowserLanguageCode());
    translate.use(this.languageService.getBrowserLanguageCode());

    this.router.events.subscribe(() => {
      const currentRoute = this.router.routerState.snapshot.root.firstChild?.routeConfig?.path;
      this.isHomePage = currentRoute === '' || currentRoute === 'home';
      this.enforcePasswordChange();
    });
  }

  
  /**
   * Enforces a password change for authenticated users(company recruiters) with temporary passwords.
   * 
   * Opens a modal dialog for changing the password if:
   * - User is authenticated
   * - User has a temporary password
   * - No modal is currently open
   * 
   * The modal is configured to prevent closing via backdrop click or keyboard escape.
   * Sets the {@link modalOpen} flag to prevent multiple modal instances.
   * 
   * @private
   * @returns {void}
   */
  private enforcePasswordChange(): void {
    if (!this.auth.isAuthenticated()) return;

    if (!this.auth.isTemporaryPassword()) return;

    if (this.modalOpen) return;

    this.modalOpen = true;

    const ref = this.modal.open(ChangePasswordModalComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true
    });

    ref.result.finally(() => {
      this.modalOpen = false;
    });
  }

}
