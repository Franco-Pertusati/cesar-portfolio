import { Component, inject, input } from '@angular/core';
import { PrtButton } from "../prt-button/prt-button.component";
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle-btn',
  imports: [PrtButton],
  templateUrl: './theme-toggle-btn.component.html',
})
export class ThemeToggleBtnComponent {
  theme = inject(ThemeService)
  variant = input<'default' | 'outlined' | 'secondary' | 'ghost' | 'destructive'>('default')

  toggleTheme() {
    this.theme.toggleTheme()
  }
}
