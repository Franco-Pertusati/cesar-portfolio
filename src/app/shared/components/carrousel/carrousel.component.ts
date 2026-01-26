import { NgClass } from '@angular/common';
import { Component, input, effect, ElementRef, viewChildren, model } from '@angular/core';
import { PrtButton } from '../../prt-ui/prt-button/prt-button.component';
import { ThemeToggleBtnComponent } from '../../prt-ui/theme-toggle-btn/theme-toggle-btn.component';

@Component({
  selector: 'app-carrousel',
  imports: [NgClass, PrtButton, ThemeToggleBtnComponent],
  templateUrl: './carrousel.component.html'
})
export class CarrouselComponent {
  images = input<string[]>([]);
  selectedImg: string = '';
  imageElements = viewChildren<ElementRef>('imgElement');
  isActive = model<boolean>(false);
  initialIndex = input<number>(0);
  
  constructor() {
    effect(() => {
      const imgs = this.images();
      const index = this.initialIndex();
      
      if (imgs && imgs.length > 0) {
        this.selectedImg = imgs[index] || imgs[0];
        
        setTimeout(() => {
          this.scrollToImage(index);
        }, 100);
      }
    });
  }
  
  selectImg(img: string, event: MouseEvent) {
    this.selectedImg = img;
    const clickedElement = event.currentTarget as HTMLElement;
    clickedElement.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }
  
  navigatePrev() {
    const imgs = this.images();
    const currentIndex = imgs.indexOf(this.selectedImg);
    if (currentIndex > 0) {
      const prevImg = imgs[currentIndex - 1];
      this.selectedImg = prevImg;
      this.scrollToImage(currentIndex - 1);
    }
  }
  
  navigateNext() {
    const imgs = this.images();
    const currentIndex = imgs.indexOf(this.selectedImg);
    if (currentIndex < imgs.length - 1) {
      const nextImg = imgs[currentIndex + 1];
      this.selectedImg = nextImg;
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