import { Component, input } from '@angular/core';
import { CarrouselComponent } from "../carrousel/carrousel.component";
import { Artwork } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-galery',
  imports: [CarrouselComponent],
  templateUrl: './galery.component.html',
})
export class GaleryComponent {
  artworks = input.required<Artwork[]>();
  title = input<string | null>();

  carouselActive = false;
  selectedImageIndex = 0;

  openCarousel(index: number) {
    this.selectedImageIndex = index;
    this.carouselActive = true;
  }
}