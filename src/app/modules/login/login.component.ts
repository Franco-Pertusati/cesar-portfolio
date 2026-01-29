import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login.component',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  async onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.supabase.signIn(this.email, this.password);
      this.router.navigate(['/admin']); // Cambia '/admin' por tu ruta protegida
    } catch (error: any) {
      this.errorMessage = 'Credenciales incorrectas. Intenta nuevamente.';
      console.error('Error al iniciar sesión:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
