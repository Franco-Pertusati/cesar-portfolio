import { Component, inject } from '@angular/core';
import { CopyButtonComponent } from '../../prt-ui/copy-button/copy-button.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-contact-dialog',
  imports: [CopyButtonComponent],
  templateUrl: './contact-dialog.component.html'
})
export class ContactDialogComponent {
  toast = inject(ToastService)

  test() {
    this.toast.success('Copiado!')
  }
}
