import { Injectable } from '@angular/core';
import { ToastType } from '../enums/enums';

@Injectable({
  providedIn: 'root',
})

export class ToastService {

  toasts: any[] = [];

  show(message: string, type: ToastType = ToastType.Info, delay = 3000) {
    let classname = '';

    switch (type) {
      case ToastType.Success:
        classname = 'bg-success text-light';
        break;
      case ToastType.Error:
        classname = 'bg-danger text-light';
        break;
      case ToastType.Warning:
        classname = 'bg-warning text-dark';
        break;
      case ToastType.Info:
        classname = 'bg-info text-dark';
        break;
    }

    this.toasts.push({ message, classname, delay, type });
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

}
