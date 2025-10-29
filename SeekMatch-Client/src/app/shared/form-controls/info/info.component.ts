import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'be-info',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, NgbPopoverModule],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent {

  @Input() message: string = '';
  @Input() placement: string = 'bottom';
}