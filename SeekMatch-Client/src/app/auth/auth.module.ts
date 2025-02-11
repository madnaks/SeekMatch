import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AuthRoutingModule } from './auth.routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterTalentModalComponent } from './modals/register-talent-modal/register-talent-modal.component';
import { RegisterRecruiterModalComponent } from './modals/register-recruiter-modal/register-recruiter-modal.component';

@NgModule({
  declarations: [
    SignUpComponent,
    RegisterTalentModalComponent,
    RegisterRecruiterModalComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    TranslateModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
