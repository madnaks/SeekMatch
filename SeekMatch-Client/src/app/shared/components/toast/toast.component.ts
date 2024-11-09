import { Component, ViewEncapsulation } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ToastComponent {

  constructor(public toastService: ToastService) {
  }
}
