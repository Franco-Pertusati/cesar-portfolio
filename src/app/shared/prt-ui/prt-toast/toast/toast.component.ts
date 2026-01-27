import { Component, computed, input } from '@angular/core';
import { Toast } from '../../../../core/interfaces/toast';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
})
export class ToastComponent {
  toast = input.required<Toast>()
  variant = input<'default' | 'succes' | 'error' | 'warning'>('default');
  styleMap: Record<string, string> = {
    default: 'bg-light',
    succes: 'bg-succes text-white border-0',
    error: 'bg-danger/50 text-white',
    warning: 'bg-warning text-black',
  };

  baseClasses = `p-3 rounded-xl border-border border z-50 w-86`;

  classes = computed(() => {
    const variant = this.styleMap[this.variant()] ?? '';
    return `${this.baseClasses} ${variant}`;
  })
}
