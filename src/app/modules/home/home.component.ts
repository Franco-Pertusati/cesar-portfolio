import { Component, inject } from '@angular/core';
import { CarrouselComponent } from '../../shared/components/carrousel/carrousel.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { DialogService } from '../../core/services/dialog.service';
import { SupabaseService } from '../../core/services/supabase.service';
import { GaleryComponent } from "../../shared/components/galery/galery.component";


@Component({
  selector: 'app-home',
  imports: [FooterComponent, GaleryComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  dialog = inject(DialogService)
  sbService = inject(SupabaseService)

  async getAllAw() {
    var artworks = await this.sbService.getAllArtworks();
    return artworks
  }
}
