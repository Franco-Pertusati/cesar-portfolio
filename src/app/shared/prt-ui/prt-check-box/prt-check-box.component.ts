import { Component, computed, input, model } from '@angular/core';

@Component({
  selector: 'prt-check-box',
  imports: [],
  templateUrl: './prt-check-box.component.html'
})
export class PrtCheckBoxComponent {
  label = input<string>('');
  labelChecked = input<string>('');
  disabled = input<boolean>(false);

  variant = input<'default' | 'outlined' | 'secondary' | 'ghost'>('default');
  size = input<'sm' | 'md' | 'lg'>('md');

  icon = input<string>();
  iconChecked = input<string>();
  iconUnchecked = input<string>();
  showIcon = input<boolean>(true);
  showLabel = input<boolean>(true);

  checked = model<boolean>(false);

  containerClasses = computed(() => {
    const variants = {
      default: this.checked() ? 'bg-text text-dark' : 'bg-dark text-text',
      outlined: 'border border-border hover:bg-neutral',
      secondary: this.checked() ? 'bg-text text-dark' : 'bg-neutral',
      ghost: 'bg-transparent hover:bg-neutral',
    };
    const base = 'inline-flex items-center justify-center gap-1.5 rounded-xl font-medium cursor-pointer select-none';
    const disabled = this.disabled() ? 'opacity-50 cursor-not-allowed' : '';
    const padding = !this.showLabel() || !this.label() ? 'p-1.5' : 'px-3 py-1.5';
    return `${base} ${disabled} ${variants[this.variant()]} ${padding}`;
  });

  checkboxClasses = computed(() => {
    const sizes = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    };
    const base = 'flex items-center justify-center rounded';
    return `${base} ${sizes[this.size()]}`;
  });

  labelClasses = computed(() => {
    const sizes = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    };

    const checked = this.checked() ? 'font-medium' : '';

    return `${sizes[this.size()]} ${checked}`;
  });

  onToggle() {
    if (!this.disabled()) {
      this.checked.set(!this.checked());
    }
  }
}
