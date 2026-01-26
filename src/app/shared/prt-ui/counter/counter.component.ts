import { Component, input, output } from '@angular/core';
import { PrtButton } from "../prt-button/prt-button.component";

@Component({
  selector: 'app-counter',
  imports: [PrtButton],
  templateUrl: './counter.component.html'
})
export class CounterComponent {
  initialValue = input<number>(0);
  minValue = input<number | undefined>(undefined);
  maxValue = input<number | undefined>(undefined);

  valueChange = output<number>();

  currentValue = 0;

  ngOnInit() {
    this.currentValue = this.initialValue();
  }

  increment() {
    const max = this.maxValue();
    if (max === undefined || this.currentValue < max) {
      this.currentValue++;
      this.valueChange.emit(this.currentValue);
    }
  }

  decrement() {
    const min = this.minValue();
    if (min === undefined || this.currentValue > min) {
      this.currentValue--;
      this.valueChange.emit(this.currentValue);
    }
  }
}
