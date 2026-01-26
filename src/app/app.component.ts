import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav2Component } from "./shared/components/nav2/nav2.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav2Component],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cesar-portfolio';
}
