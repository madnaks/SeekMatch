import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { AuthRoutingModule } from './auth.routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    SignUpComponent,
    LogInComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    TranslateModule,
    SharedModule
  ]
})
export class AuthModule { }
