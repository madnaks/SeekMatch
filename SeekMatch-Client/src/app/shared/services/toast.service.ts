import { Injectable } from '@angular/core';
import { ToastType } from '../enums/enums';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})

export class ToastService {

  toasts: any[] = [];

  constructor(private translate: TranslateService) {}

  private show(message: string, type: ToastType = ToastType.Info, delay = 3000): void {
    let classname = 'toast-info';
    let statutIcon = 'assets/icons/status/';
    
    switch (type) {
      case ToastType.Success:
        classname = 'toast-success';
        statutIcon += 'success.svg';
        break;
      case ToastType.Error:
        classname = 'toast-error';
        statutIcon += 'error.svg';
        break;
      case ToastType.Warning:
        classname = 'toast-warning';
        statutIcon += 'warning.svg';
        break;
      case ToastType.Info:
        classname = 'toast-info';
        statutIcon += 'information.svg';
        break;
    }

    this.toasts.push({ message, classname, delay, type, statutIcon });
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  public showSuccessMessage(defaultMessage: string): void {
    this.show(this.translateMessage(defaultMessage), ToastType.Success);
  }

  public showErrorMessage(defaultMessage: string, error?: any): void {
    // Check if the error has a `message` property
    let errorMessage = this.translateMessage(defaultMessage);
    if (error && error.error && error.error.message) {
      errorMessage = `${errorMessage}: ${error.error.message}`;
    }
    
    this.show(errorMessage, ToastType.Error);
  }

  private translateMessage(message: string): string {
    const translatedMessage = this.translate.instant(message);
    return translatedMessage === message ? message : translatedMessage;
  }

}
