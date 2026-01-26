import { Injectable, signal } from '@angular/core';
import { Toast } from '../interfaces/toast';


@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toastList = signal<Toast[]>([])

  createToast(toast: Toast) {
    this.toastList.set([...this.toastList(), toast]);
    setTimeout(() => {
      this.closeToast()
    }, 3000);
  }

  default(title: string, message?: string) {
    const newToast: Toast = {
      title: title,
      message: message || undefined,
      icon: 'info',
      variant: 'default'
    }
    this.createToast(newToast)
  }

  error(title: string, message?: string) {
    const newToast: Toast = {
      title: title,
      message: message || undefined,
      icon: 'error',
      variant: 'error'
    }
    this.createToast(newToast)
  }

  success(title: string, message?: string) {
    const newToast: Toast = {
      title: title,
      message: message || undefined,
      icon: 'check_circle',
      variant: 'succes'
    }
    this.createToast(newToast)
  }

  closeToast() {
    const currentToasts = this.toastList();
    this.toastList.set(currentToasts.slice(1));
  }
}
