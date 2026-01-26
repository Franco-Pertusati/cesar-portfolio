import { Component, inject } from '@angular/core';
import { PrtButton } from '../../shared/prt-ui/prt-button/prt-button.component';
import { PrtRadioComponent, RadioOption } from '../../shared/prt-ui/prt-radio/prt-radio.component';

@Component({
  selector: 'app-catalog',
  imports: [PrtRadioComponent, PrtButton],
  templateUrl: './catalog.component.html'
})
export class CatalogComponent {
  macetaOptions: RadioOption[] = [
    {
      label: '20cm',
      value: '20cm',
      iconChecked: 'check'
    },
    {
      label: '30cm',
      value: '30cm',
      iconChecked: 'check'
    },
    {
      label: '35cm',
      value: '35cm',
      iconChecked: 'check'
    }
  ]
}
