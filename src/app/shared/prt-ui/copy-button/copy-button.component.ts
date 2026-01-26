import { Component, input, signal } from '@angular/core';
import { PrtButton } from '../prt-button/prt-button.component';

@Component({
  selector: 'app-copy-button',
  imports: [PrtButton],
  templateUrl: './copy-button.component.html'
})
export class CopyButtonComponent {
  variant = input<'default' | 'outlined' | 'secondary' | 'ghost' | 'destructive'>('secondary');
  classList = input<string>('');
  label = input<string>('');
  icon = input<string>('');
  showLabel = input<boolean>(true);
  showIcon = input<boolean>(true);
  textToCopy = input.required<string>();
  labelAfterCopy = input<string>('');
  iconAfterCopy = input<string>('');

  // Señales para controlar el estado actual del botón
  currentLabel = signal<string>('');
  currentIcon = signal<string>('');
  private timeoutId?: number;

  ngOnInit() {
    // Inicializar con los valores originales
    this.currentLabel.set(this.label());
    this.currentIcon.set(this.icon());
  }

  async copyContent() {
    try {
      await navigator.clipboard.writeText(this.textToCopy());
      
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      const afterLabel = this.labelAfterCopy();
      const afterIcon = this.iconAfterCopy();
      
      if (afterLabel || afterIcon) {
        if (afterLabel) {
          this.currentLabel.set(afterLabel);
        }
        if (afterIcon) {
          this.currentIcon.set(afterIcon);
        }

        this.timeoutId = window.setTimeout(() => {
          this.currentLabel.set(this.label());
          this.currentIcon.set(this.icon());
        }, 2000);
      }
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
    }
  }

  ngOnDestroy() {
    // Limpiar timeout al destruir el componente
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}