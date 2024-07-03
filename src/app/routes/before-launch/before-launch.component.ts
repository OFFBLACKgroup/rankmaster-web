import { Component } from '@angular/core';
import { ExampleSliderComponent } from './components/example-slider/example-slider.component';
import { ActionablesComponent } from './components/actionables/actionables.component';

@Component({
  selector: 'app-before-launch',
  standalone: true,
  imports: [ExampleSliderComponent, ActionablesComponent],
  templateUrl: './before-launch.component.html',
  styleUrl: './before-launch.component.css',
})
export class BeforeLaunchComponent {
}
