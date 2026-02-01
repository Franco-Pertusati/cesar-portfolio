import { NgClass } from '@angular/common';
import { Component, input, effect, ElementRef, viewChildren, model, inject } from '@angular/core';
import { PrtButton } from '../../prt-ui/prt-button/prt-button.component';
import { ThemeToggleBtnComponent } from '../../prt-ui/theme-toggle-btn/theme-toggle-btn.component';
import { Artwork } from '../../../core/services/supabase.service';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-carrousel',
  imports: [NgClass, PrtButton, ThemeToggleBtnComponent],
  templateUrl: './carrousel.component.html'
})
export class CarrouselComponent {
  images = input<Artwork[]>([]);
  selectedArtwork: Artwork | null = null;
  imageElements = viewChildren<ElementRef>('imgElement');
  isActive = model<boolean>(false);
  initialIndex = input<number>(0);
  orderService = inject(OrderService)

  constructor() {
    effect(() => {
      const artworks = this.images();
      const index = this.initialIndex();

      if (artworks && artworks.length > 0) {
        this.selectedArtwork = artworks[index] || artworks[0];

        setTimeout(() => {
          this.scrollToImage(index);
        }, 100);
      }
    });
  }

  addImgToOrder() {
    if (this.selectedArtwork) {
      this.orderService.setArtwork(this.selectedArtwork)
    }

    this.closeCarrousel()
  }

  selectImg(artwork: Artwork, event: MouseEvent) {
    this.selectedArtwork = artwork;
    const clickedElement = event.currentTarget as HTMLElement;
    clickedElement.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  navigatePrev() {
    const artworks = this.images();
    const currentIndex = artworks.findIndex(a => a === this.selectedArtwork);

    if (currentIndex > 0) {
      this.selectedArtwork = artworks[currentIndex - 1];
      this.scrollToImage(currentIndex - 1);
    }
  }

  navigateNext() {
    const artworks = this.images();
    const currentIndex = artworks.findIndex(a => a === this.selectedArtwork);

    if (currentIndex < artworks.length - 1) {
      this.selectedArtwork = artworks[currentIndex + 1];
      this.scrollToImage(currentIndex + 1);
    }
  }

  closeCarrousel() {
    this.isActive.set(false);
  }

  private scrollToImage(index: number) {
    const elements = this.imageElements();
    if (elements && elements[index]) {
      elements[index].nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }
}