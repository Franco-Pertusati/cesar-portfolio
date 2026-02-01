import { Component, inject } from '@angular/core';
import { ThemeToggleBtnComponent } from '../../prt-ui/theme-toggle-btn/theme-toggle-btn.component';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';
import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'app-nav2',
  imports: [ThemeToggleBtnComponent],
  templateUrl: './nav2.component.html'
})
export class Nav2Component {
  dialog = inject(DialogService)

  openContact() {
    this.dialog.openDialog(ContactDialogComponent)
  }
}
