import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';

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

  artworkQueue: ArtworkItem[] = [];
  isDragging = false;
  isUploadingAll = false;
  errorMessage = '';
  successMessage = '';

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

        // Limitar dimensiones máximas a 1200px en el lado más largo
        let width = img.width;
        let height = img.height;
        const maxSize = 1200;

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Error al convertir imagen'));
            const newFile = new File([blob], file.name.split('.')[0] + '.webp', {
              type: 'image/webp'
            });
            resolve(newFile);
          },
          'image/webp',
          0.82 // Calidad del 82% - buen balance tamaño/calidad
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