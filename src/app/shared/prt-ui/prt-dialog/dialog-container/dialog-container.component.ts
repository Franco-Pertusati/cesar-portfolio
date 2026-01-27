import { Component, inject } from '@angular/core';
import { DialogComponent } from "../dialog/dialog.component";
import { CommonModule } from '@angular/common';
import { DialogService } from '../../../../core/services/dialog.service';

@Component({
  selector: 'app-dialog-container',
  imports: [DialogComponent, CommonModule],
  templateUrl: './dialog-container.component.html',
})
export class DialogContainerComponent {
  dialog = inject(DialogService);
}
