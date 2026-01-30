import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Cliente único fuera de la clase
const supabaseUrl = 'https://kgfsisjksyirbiizvnhp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZnNpc2prc3lpcmJpaXp2bmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2Njg5NTksImV4cCI6MjA4NDI0NDk1OX0.nwGmRHxArqkawLt5urq2PhwByoMn7se-mdtCFwXFmvc';

let supabaseInstance: SupabaseClient | null = null;

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    if (!supabaseInstance) {
      supabaseInstance = createClient(supabaseUrl, supabaseKey);
    }
    this.supabase = supabaseInstance;
  }

  async getAllArtworks() {
    const { data, error } = await this.supabase
      .from('obras')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getFavoriteArtworks() {
    const { data, error } = await this.supabase
      .from('obras')
      .select('*')
      .eq('favorite', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getFlowerPotDesigns() {
    const { data, error } = await this.supabase
      .from('obras')
      .select('*')
      .eq('flowerpot_desing', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
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
      .from('Fotos obras')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error al subir:', uploadError);
      throw uploadError;
    }

    // 3. Obtener URL pública de la imagen
    const { data: urlData } = this.supabase.storage
      .from('Fotos obras')
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
    return data;
    
  } catch (error) {
    console.error('Error completo:', error);
    throw error;
  }
}
}