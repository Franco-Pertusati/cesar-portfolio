// minutes-to-time.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutesToTime',
  standalone: true
})
export class MinutesToTimePipe implements PipeTransform {
  transform(minutes: number): string {
    if (minutes === null || minutes === undefined || minutes < 0) {
      return '0:00';
    }
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    // Formato: H:MM (los minutos siempre con 2 dígitos)
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  }
}