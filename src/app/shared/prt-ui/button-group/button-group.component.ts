import { Component, input, signal } from '@angular/core';
import { TabItem } from '../../core/interfaces/buttonList';
import { PrtButton } from "../prt-button/prt-button.component";
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-button-group',
  imports: [PrtButton, NgComponentOutlet],
  templateUrl: './button-group.component.html'
})
export class ButtonGroupComponent {
  tabs = input.required<TabItem[]>();
  selectedIndex = signal(0);

  selectTab(index: number) {
    this.selectedIndex.set(index);
  }
}