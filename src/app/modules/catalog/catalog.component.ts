import { Component, inject, signal } from '@angular/core';
import { PrtButton } from '../../shared/prt-ui/prt-button/prt-button.component';
import { PrtRadioComponent, RadioOption } from '../../shared/prt-ui/prt-radio/prt-radio.component';
import { DialogService } from '../../core/services/dialog.service';
import { DesingGaleyComponent } from '../../shared/components/desing-galey/desing-galey.component';

interface PotflowerOrder {
  client: string;
  potflower: number;
  desing: string;
}

@Component({
  selector: 'app-catalog',
  imports: [PrtRadioComponent, PrtButton],
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

  // Signal para la maceta seleccionada
  selectedPotflower = signal<string>('');

  // Signal para el diseño seleccionado (por ahora vacío)
  selectedDesing = signal<string>('');

  // Signal para el cliente (puedes obtenerlo de un servicio de autenticación)
  client = signal<string>('Cliente Demo');

  dialog = inject(DialogService);

  openCatalogDialog() {
    this.dialog.openDialog(DesingGaleyComponent);
  }

  // Método para manejar el cambio de selección de maceta
  onPotflowerChange(value: string) {
    this.selectedPotflower.set(value);
    console.log('Maceta seleccionada:', value);
  }

  // Método para crear la orden
  createOrder() {
    // Validar que se haya seleccionado una maceta
    if (!this.selectedPotflower()) {
      alert('Por favor selecciona un tamaño de maceta');
      return;
    }

    // Validar que se haya seleccionado un diseño (por ahora comentado)
    // if (!this.selectedDesing()) {
    //   alert('Por favor selecciona un diseño');
    //   return;
    // }

    // Crear la orden
    const order: PotflowerOrder = {
      client: this.client(),
      potflower: Number(this.selectedPotflower()),
      desing: this.selectedDesing() // Por ahora vacío
    };

    console.log('Orden creada:', order);

    // Generar mensaje de WhatsApp
    this.sendWhatsAppOrder(order);
  }

  // Método para enviar la orden por WhatsApp
  sendWhatsAppOrder(order: PotflowerOrder) {
    const phoneNumber = '549234545-5860'; // Reemplaza con el número real

    const message = `¡Hola! Quiero hacer un pedido:
    
🌸 *Nuevo Pedido de Maceta*
👤 Cliente: ${order.client}
📏 Tamaño: ${order.potflower}cm
${order.desing ? `🎨 Diseño: ${order.desing}` : '🎨 Diseño: Por seleccionar'}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  }

  // Método para verificar si se puede crear la orden
  canCreateOrder(): boolean {
    return !!this.selectedPotflower();
    // Cuando implementes el diseño, agregar: && !!this.selectedDesing()
  }
}