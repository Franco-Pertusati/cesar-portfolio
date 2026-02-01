import { Component, inject } from '@angular/core';
import { Artwork, SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-consult-dialog.component',
  imports: [],
  templateUrl: './consult-dialog.component.html',
})
export class ConsultDialogComponent {
  sb = inject(SupabaseService)
}
