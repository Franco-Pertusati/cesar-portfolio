import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav2Component } from "./shared/components/nav2/nav2.component";
import { ToastListComponent } from "./shared/prt-ui/prt-toast/toast-list/toast-list.component";
import { DialogContainerComponent } from "./shared/prt-ui/prt-dialog/dialog-container/dialog-container.component";
import { SupabaseService } from './core/services/supabase.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav2Component, ToastListComponent, DialogContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  sbService = inject(SupabaseService);

  ngOnInit() {
    this.sbService.getAllArtworks()
  }
}
