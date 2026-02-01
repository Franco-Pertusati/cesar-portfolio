import { Component, inject, signal } from '@angular/core';
import { PrtButton } from '../../shared/prt-ui/prt-button/prt-button.component';
import { PrtRadioComponent, RadioOption } from '../../shared/prt-ui/prt-radio/prt-radio.component';
import { DialogService } from '../../core/services/dialog.service';
import { NgClass } from '@angular/common';
import { OrderService, PotflowerOrder } from '../../core/services/order.service';
import { CarrouselComponent } from "../../shared/components/carrousel/carrousel.component"; // ajusta la ruta
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-catalog',
  imports: [PrtRadioComponent, PrtButton, NgClass, CarrouselComponent],
  templateUrl: './catalog.component.html'
})
export class CatalogComponent {

  // ─── Opciones de macetas ──────────────────────────────────────────────

  macetaOptions: RadioOption[] = [
    { label: '20cm', value: '20', iconChecked: 'check' },
    { label: '30cm', value: '30', iconChecked: 'check' },
    { label: '35cm', value: '35', iconChecked: 'check' }
  ];

  // ─── Inyecciones ──────────────────────────────────────────────────────

  sbService = inject(SupabaseService);
  orderService = inject(OrderService);

  // Signal local para conectar con el model() del radio
  selectedPotflower = signal<string>(String(this.orderService.potflower()));
  isCarrouselOpen: boolean = false;

  // ─── Métodos del template ─────────────────────────────────────────────

  openCatalogDialog(): void {
    this.isCarrouselOpen = true;
  }

  onPotflowerChange(value: string): void {
    this.selectedPotflower.set(value);
    this.orderService.setPotflower(Number(value));
  }

  handleClientName(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.orderService.setClient(inputValue);
  }

  createOrder(): void {
    const order = this.orderService.order(); // lees el snapshot actual
    console.log('Orden creada:', order);
    this.sendWhatsAppOrder(order);
  }

  // ─── WhatsApp ─────────────────────────────────────────────────────────

  private sendWhatsAppOrder(order: PotflowerOrder): void {
    const phoneNumber = '5492345455860';
    const message =
      `¡Hola! Quiero hacer un pedido:
 *Nuevo Pedido de Maceta*
 Cliente: ${order.client}
Tamaño: ${order.potflower}cm
${order.artwork ? `Diseño: ${order.artwork.id}` : '🎨 Diseño: Por seleccionar'}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }
}