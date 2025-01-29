import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule, NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { HeaderSimplifiedComponent } from './components/header-simplified/header-simplified.component';
import { LoginModalComponent } from './modals/login-modal/login-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastComponent } from './components/toast/toast.component';
import { FooterComponent } from './components/footer/footer.component';
import { TalentPreviewModalComponent } from './modals/talent-preview-modal/talent-preview-modal.component';

@NgModule({
  declarations: [
    HeaderComponent,
    HeaderSimplifiedComponent,
    FooterComponent,
    LoginModalComponent,
    TalentPreviewModalComponent,
    ToastComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    NgbToast,
    TranslateModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    HeaderComponent,
    HeaderSimplifiedComponent,
    FooterComponent,
    LoginModalComponent,
    TalentPreviewModalComponent,
    ToastComponent
  ]
})
export class SharedModule { }
