// money.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'money',
  standalone: true
})
export class MoneyPipe implements PipeTransform {
  transform(value: number, currency: string = '$'): string {
    if (value === null || value === undefined) {
      return `${currency}0.00`;
    }
    
    const formatted = value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    return `${currency}${formatted}`;
  }
}