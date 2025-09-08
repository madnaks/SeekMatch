import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login-button',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './login-button.component.html',
  styleUrl: './login-button.component.scss'
})
export class LoginButtonComponent { 
  @Input({required: true}) isLoading: boolean = false;
}
