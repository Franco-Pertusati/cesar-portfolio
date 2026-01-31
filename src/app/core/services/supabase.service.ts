import { Injectable, signal, computed } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Cliente único fuera de la clase
const supabaseUrl = 'https://kgfsisjksyirbiizvnhp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZnNpc2prc3lpcmJpaXp2bmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2Njg5NTksImV4cCI6MjA4NDI0NDk1OX0.nwGmRHxArqkawLt5urq2PhwByoMn7se-mdtCFwXFmvc';

let supabaseInstance: SupabaseClient | null = null;

export interface Artwork {
  id?: number;
  fecha_creacion: string;
  favorite: boolean;
  flowerpot_desing: boolean;
  image_url: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private artworks = signal<Artwork[]>([]);

  constructor() {
    if (!supabaseInstance) {
      supabaseInstance = createClient(supabaseUrl, supabaseKey);
    }
    this.supabase = supabaseInstance;
  }

  // Getters computados (reactivos)
  allArtworks = computed(() => [...this.artworks()]);

  favoriteArtworks = computed(() =>
    this.artworks().filter(artwork => artwork.favorite)
  );

  flowerpotDesignArtworks = computed(() =>
    this.artworks().filter(artwork => artwork.flowerpot_desing)
  );

  async getAllArtworks() {
    const { data, error } = await this.supabase
      .from('obras')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Actualizar la señal
    this.artworks.set(data || []);
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    await this.supabase.auth.signOut();
    // Limpiar artworks al cerrar sesión
    this.artworks.set([]);
  }

  async getUser() {
    const { data } = await this.supabase.auth.getUser();
    return data.user;
  }

  async createArtwork(
    file: File,
    fechaCreacion: string,
    favorite: boolean,
    flowerpotDesing: boolean
  ) {
    try {
      // Verificar sesión
      const { data: { session }, error: sessionError } = await this.supabase.auth.getSession();
      console.log('Sesión activa:', session);
      console.log('Error de sesión:', sessionError);

      if (!session) {
        throw new Error('No hay sesión activa');
      }

      // 1. Generar nombre único para la imagen
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      console.log('Subiendo archivo:', filePath);

      // 2. Subir imagen al bucket
      const { error: uploadError } = await this.supabase.storage
        .from('fotos-obras') // Sin espacios
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error al subir:', uploadError);
        throw uploadError;
      }

      // 3. Obtener URL pública de la imagen
      const { data: urlData } = this.supabase.storage
        .from('fotos-obras') // Sin espacios
        .getPublicUrl(filePath);

      console.log('URL generada:', urlData.publicUrl);

      // 4. Insertar registro
      const insertData = {
        fecha_creacion: fechaCreacion,
        favorite: favorite,
        flowerpot_desing: flowerpotDesing,
        image_url: urlData.publicUrl
      };

      console.log('Datos a insertar:', insertData);

      const { data, error } = await this.supabase
        .from('obras')
        .insert(insertData)
        .select();

      console.log('Resultado insert:', data);
      console.log('Error insert:', error);

      if (error) throw error;

      // Actualizar la señal agregando el nuevo artwork al inicio
      if (data && data.length > 0) {
        this.artworks.update(artworks => [data[0], ...artworks]);
      }

      return data;
    } catch (error) {
      console.error('Error completo:', error);
      throw error;
    }
  }
}