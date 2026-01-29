// auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard = async () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);
  
  const user = await supabase.getUser();
  
  if (!user) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};