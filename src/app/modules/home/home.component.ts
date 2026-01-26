import { Component, inject } from '@angular/core';
import { ItemContainerComponent } from '../../shared/prt-ui/item-container/item-container.component';
import { PrtButton } from '../../shared/prt-ui/prt-button/prt-button.component';
import { CarrouselComponent } from '../../shared/components/carrousel/carrousel.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { DialogService } from '../../core/services/dialog.service';
import { ContactDialogComponent } from '../../shared/components/contact-dialog/contact-dialog.component';


@Component({
  selector: 'app-home',
  imports: [ItemContainerComponent, PrtButton, CarrouselComponent, FooterComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  dialog = inject(DialogService)
  images = [
    "https://picsum.photos/seed/1/800/600",
    "https://picsum.photos/seed/2/800/600",
    "https://picsum.photos/seed/3/800/600",
    "https://picsum.photos/seed/4/800/600",
    "https://picsum.photos/seed/5/800/600",
    "https://picsum.photos/seed/6/800/600",
    "https://picsum.photos/seed/7/800/600",
    "https://picsum.photos/seed/8/800/600",
    "https://picsum.photos/seed/9/800/600",
    "https://picsum.photos/seed/10/800/600",
    "https://picsum.photos/seed/11/800/600",
    "https://picsum.photos/seed/12/800/600",
    "https://picsum.photos/seed/13/800/600",
    "https://picsum.photos/seed/14/800/600",
  ]
  carouselActive = false;
  selectedImageIndex = 0;

  openContactDialog() {
    this.dialog.openDialog(ContactDialogComponent)
  }

  openCarousel(index: number) {
    this.selectedImageIndex = index;
    this.carouselActive = true;
  }
}
