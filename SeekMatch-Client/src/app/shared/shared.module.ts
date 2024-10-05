import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { HeaderSimplifiedComponent } from './components/header-simplified/header-simplified.component';
import { LoginModalComponent } from './modals/login-modal/login-modal.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HeaderComponent,
    HeaderSimplifiedComponent,
    LoginModalComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    TranslateModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    HeaderComponent,
    HeaderSimplifiedComponent,
    LoginModalComponent
  ]
})
export class SharedModule { }
