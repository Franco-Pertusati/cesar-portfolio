import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html'
})
export class AdminComponent {
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  formData = {
    fecha_creacion: '',
    favorite: false,
    flowerpot_desing: false
  };

  selectedFile: File | null = null;
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  async onSubmit() {
    if (!this.selectedFile) {
      this.errorMessage = 'Por favor selecciona una imagen';
      return;
    }

    if (!this.formData.fecha_creacion) {
      this.errorMessage = 'Por favor selecciona la fecha de creación';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.supabase.createArtwork(
        this.selectedFile,
        this.formData.fecha_creacion,
        this.formData.favorite,
        this.formData.flowerpot_desing
      );

      this.successMessage = 'Obra creada exitosamente';
      
      // Reset form
      this.formData = {
        fecha_creacion: '',
        favorite: false,
        flowerpot_desing: false
      };
      this.selectedFile = null;
      
      // Reset file input
      const fileInput = document.getElementById('image') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      this.errorMessage = 'Error al crear la obra: ' + error.message;
      console.error('Error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async logout() {
    await this.supabase.signOut();
    this.router.navigate(['/login']);
  }
}