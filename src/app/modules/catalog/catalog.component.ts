import { Component, computed, inject, signal } from '@angular/core';
import { PrtButton } from '../../shared/prt-ui/prt-button/prt-button.component';
import { PrtRadioComponent, RadioOption } from '../../shared/prt-ui/prt-radio/prt-radio.component';
import { DialogService } from '../../core/services/dialog.service';
import { DesingGaleyComponent } from '../../shared/components/desing-galey/desing-galey.component';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PotflowerOrder {
  client: string;
  potflower: number;
  desing: string;
}

@Component({
  selector: 'app-catalog',
  imports: [PrtRadioComponent, PrtButton, NgClass],
  templateUrl: './catalog.component.html'
})
export class CatalogComponent {
  // Opciones de macetas
  macetaOptions: RadioOption[] = [
    {
      label: '20cm',
      value: '20',
      iconChecked: 'check'
    },
    {
      label: '30cm',
      value: '30',
      iconChecked: 'check'
    },
    {
      label: '35cm',
      value: '35',
      iconChecked: 'check'
    }
  ];

  selectedDesing = signal<string>('');
  selectedPotflower = signal<string>('');
  clientName = signal<string>('');

  dialog = inject(DialogService);

  openCatalogDialog() {
    this.dialog.openDialog(DesingGaleyComponent);
  }

  // Computed para validar que nombre y maceta estén seleccionados
  isValidOrder = computed(() => {
    if (this.selectedPotflower() && this.clientName().length > 2) {
      return true;
    }

    return false
  });

  // Método para manejar el cambio de selección de maceta
  onPotflowerChange(value: string) {
    this.selectedPotflower.set(value);
    console.log('Maceta seleccionada:', value);
  }

  handleClientName(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.clientName.set(inputValue)
  }

  // Método para crear la orden
  createOrder() {
    // Validar que se haya seleccionado una maceta


    // Validar que se haya seleccionado un diseño (por ahora comentado)
    // if (!this.selectedDesing()) {
    //   alert('Por favor selecciona un diseño');
    //   return;
    // }

    // Crear la orden
    const order: PotflowerOrder = {
      client: this.clientName(),
      potflower: Number(this.selectedPotflower()),
      desing: this.selectedDesing() // Por ahora vacío
    };

    console.log('Orden creada:', order);

    // Generar mensaje de WhatsApp
    this.sendWhatsAppOrder(order);
  }

  // Método para enviar la orden por WhatsApp
  sendWhatsAppOrder(order: PotflowerOrder) {
    const phoneNumber = '5492345455860'; // Reemplaza con el número real

    const message = `¡Hola! Quiero hacer un pedido:
    
 *Nuevo Pedido de Maceta*
 Cliente: ${order.client}
Tamaño: ${order.potflower}cm
${order.desing ? `🎨 Diseño: ${order.desing}` : '🎨 Diseño: Por seleccionar'}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  }

  canCreateOrder(): boolean {
    return !!this.selectedPotflower();
  }
}