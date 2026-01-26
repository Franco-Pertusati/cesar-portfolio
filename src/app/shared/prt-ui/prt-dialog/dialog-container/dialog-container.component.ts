import { Component, inject } from '@angular/core';
import { DialogComponent } from "../dialog/dialog.component";
import { DialogService } from '../../../core/services/dialog.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-container',
  imports: [DialogComponent, CommonModule],
  templateUrl: './dialog-container.component.html',
})
export class DialogContainerComponent {
  dialog = inject(DialogService);
}
