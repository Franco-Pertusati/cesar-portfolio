import { Component, computed, input, model, output } from '@angular/core';

export interface RadioOption {
  value: string;
  label: string;
  labelChecked?: string;
  icon?: string;
  iconChecked?: string;
  iconUnchecked?: string;
  disabled?: boolean;
}


@Component({
  selector: 'prt-radio',
  imports: [],
  templateUrl: './prt-radio.component.html'
})
export class PrtRadioComponent {
  options = input.required<RadioOption[]>();

  variant = input<'default' | 'outlined' | 'secondary' | 'ghost'>('secondary');
  size = input<'sm' | 'md' | 'lg'>('md');

  showIcon = input<boolean>(true);
  showLabel = input<boolean>(true);

  selectedValue = model<string>('');

  selectionChange = output<string>();

  containerClasses = computed(() => {
    return 'inline-flex gap-2 flex-wrap';
  });

  getOptionClasses(option: RadioOption) {
    const isSelected = this.selectedValue() === option.value;
    const isDisabled = option.disabled;

    const variants = {
      default: isSelected ? 'bg-text text-dark' : 'bg-dark text-text',
      outlined: 'border border-border hover:bg-neutral',
      secondary: isSelected ? 'bg-text text-dark' : 'bg-transparent',
      ghost: 'bg-transparent hover:bg-neutral',
    };

    const base = 'inline-flex items-center justify-center gap-1.5 rounded-xl font-medium cursor-pointer select-none';
    const disabled = isDisabled ? 'opacity-50 cursor-not-allowed' : '';
    const padding = !this.showLabel() || !option.label ? 'p-1.5' : 'px-3 py-1.5';

    return `${base} ${disabled} ${variants[this.variant()]} ${padding}`;
  }

  getIconClasses() {
    const sizes = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    };
    const base = 'flex items-center justify-center rounded';
    return `${base} ${sizes[this.size()]}`;
  }

  getLabelClasses(option: RadioOption) {
    const sizes = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    };

    const isSelected = this.selectedValue() === option.value;
    const fontWeight = isSelected ? 'font-medium' : '';

    return `${sizes[this.size()]} ${fontWeight}`;
  }

  onSelect(option: RadioOption) {
    if (!option.disabled) {
      this.selectedValue.set(option.value);
      this.selectionChange.emit(option.value);
    }
  }

  getDisplayIcon(option: RadioOption): string | undefined {
    const isSelected = this.selectedValue() === option.value;

    if (isSelected && option.iconChecked) {
      return option.iconChecked;
    } else if (!isSelected && option.iconUnchecked) {
      return option.iconUnchecked;
    } else if (option.icon) {
      return option.icon;
    }

    return undefined;
  }

  getDisplayLabel(option: RadioOption): string {
    const isSelected = this.selectedValue() === option.value;
    return isSelected && option.labelChecked ? option.labelChecked : option.label;
  }
}
