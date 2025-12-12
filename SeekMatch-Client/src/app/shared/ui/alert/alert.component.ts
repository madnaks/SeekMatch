import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'be-alert',
  standalone: true,
  imports: [
    CommonModule,
    NgbAlert,
    TranslateModule
  ],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
    @Input() type: 'success' | 'info' | 'warning' | 'danger' = 'info';
    @Input() messageKey: string = '';

    public messageClosed: boolean = false;
}
