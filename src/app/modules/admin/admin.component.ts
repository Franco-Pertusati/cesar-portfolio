import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';
import { DialogService } from '../../core/services/dialog.service';
import { ConsultDialogComponent } from '../../shared/components/consult-dialog/consult-dialog.component';

interface ArtworkItem {
  file: File;
  preview: string;
  fecha_creacion: string;
  favorite: boolean;
  flowerpot_desing: boolean;
  isLoading: boolean;
  error: string;
  uploaded: boolean;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html'
})
export class AdminComponent {
  private supabase = inject(SupabaseService);
  private router = inject(Router);
  dialog = inject(DialogService)

  artworkQueue: ArtworkItem[] = [];
  isDragging = false;
  isUploadingAll = false;
  errorMessage = '';
  successMessage = '';

  openCatalog() {
    this.dialog.openDialog(ConsultDialogComponent)
  }

  // --- Drag & Drop Events ---
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files) this.processFiles(files);
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) this.processFiles(files);
  }

  // --- Procesamiento de archivos ---
  async processFiles(files: FileList) {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    for (const file of imageFiles) {
      const optimized = await this.convertToWebP(file);
      const preview = URL.createObjectURL(optimized);
      this.artworkQueue.push({
        file: optimized,
        preview,
        fecha_creacion: new Date().toISOString().split('T')[0],
        favorite: false,
        flowerpot_desing: false,
        isLoading: false,
        error: '',
        uploaded: false
      });
    }
  }

  // --- Conversión y optimización a WebP ---
  private convertToWebP(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);

        const targetSize = 800;

        // Calcular el recorte centrado (crop al centro, relación 1:1)
        const size = Math.min(img.width, img.height);
        const offsetX = (img.width - size) / 2;
        const offsetY = (img.height - size) / 2;

        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');

        // drawImage con recorte: toma el cuadrado central y lo escala a 800x800
        ctx?.drawImage(
          img,
          offsetX, offsetY, size, size, // Origen: recorte centrado
          0, 0, targetSize, targetSize   // Destino: canvas 800x800
        );

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Error al convertir imagen'));
            const newFile = new File([blob], file.name.split('.')[0] + '.webp', {
              type: 'image/webp'
            });
            resolve(newFile);
          },
          'image/webp',
          0.82
        );
      };
      img.onerror = () => reject(new Error('Error al cargar imagen'));
      img.src = url;
    });
  }

  // --- Eliminar item de la cola
  removeItem(index: number) {
    URL.revokeObjectURL(this.artworkQueue[index].preview);
    this.artworkQueue.splice(index, 1);
  }

  // --- Subir uno solo ---
  async uploadSingle(index: number) {
    const item = this.artworkQueue[index];
    if (!item.fecha_creacion) {
      item.error = 'Selecciona una fecha';
      return;
    }

    item.isLoading = true;
    item.error = '';

    try {
      await this.supabase.createArtwork(
        item.file,
        item.fecha_creacion,
        item.favorite,
        item.flowerpot_desing
      );
      item.uploaded = true;
    } catch (error: any) {
      item.error = error.message || 'Error al subir';
    } finally {
      item.isLoading = false;
    }
  }

  // --- Subir todos ---
  async uploadAll() {
    const pending = this.artworkQueue.filter(item => !item.uploaded);
    if (pending.length === 0) return;

    this.isUploadingAll = true;
    this.errorMessage = '';
    this.successMessage = '';

    for (let i = 0; i < this.artworkQueue.length; i++) {
      if (!this.artworkQueue[i].uploaded) {
        await this.uploadSingle(i);
      }
    }

    this.isUploadingAll = false;
    const allUploaded = this.artworkQueue.every(item => item.uploaded);
    if (allUploaded) {
      this.successMessage = `${this.artworkQueue.length} obra(s) subida(s) exitosamente`;
      this.clearQueue();
    }
  }

  // --- Limpiar cola ---
  clearQueue() {
    this.artworkQueue.forEach(item => URL.revokeObjectURL(item.preview));
    this.artworkQueue = [];
  }

  // --- Logout ---
  async logout() {
    await this.supabase.signOut();
    this.router.navigate(['/login']);
  }
}