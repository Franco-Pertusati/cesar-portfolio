import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';
import { PrtButton } from '../../prt-ui/prt-button/prt-button.component';
import { ThemeToggleBtnComponent } from '../../prt-ui/theme-toggle-btn/theme-toggle-btn.component';
import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'app-cacha-nav',
  imports: [PrtButton, CommonModule, ThemeToggleBtnComponent],
  templateUrl: './cacha-nav.component.html'
})
export class CachaNavComponent {
  isMenuOpen = false;
  dialog = inject(DialogService)

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  openContact() {
    this.dialog.openDialog(ContactDialogComponent)
    this.closeMenu()
  }
}