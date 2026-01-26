import { Component, inject, input } from '@angular/core';
import { PrtButton } from "../prt-button/prt-button.component";
import { Router } from '@angular/router';


interface ButtonInterface {
  label?: string,
  icon?: string,
  notifications?: number
  route: string
}

@Component({
  selector: 'app-btn-group',
  imports: [PrtButton],
  templateUrl: './btn-group.component.html',
})
export class BtnGroupComponent {
  buttons = input<ButtonInterface[]>([])

  router = inject(Router)

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
