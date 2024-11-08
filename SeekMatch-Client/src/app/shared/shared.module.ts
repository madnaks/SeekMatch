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

@NgModule({
  declarations: [
    HeaderComponent,
    HeaderSimplifiedComponent,
    LoginModalComponent,
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
    LoginModalComponent,
    ToastComponent
  ]
})
export class SharedModule { }
