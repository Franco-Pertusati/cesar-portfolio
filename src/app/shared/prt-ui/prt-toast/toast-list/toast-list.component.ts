import { Component, inject, input } from '@angular/core';
import { ToastComponent } from "../toast/toast.component";
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-toast-list',
  imports: [ToastComponent],
  templateUrl: './toast-list.component.html',
})
export class ToastListComponent {
  toasts = inject(ToastService)
}
