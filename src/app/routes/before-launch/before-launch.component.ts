import { Component } from '@angular/core';
import { ExampleSliderComponent } from './components/example-slider/example-slider.component';
import { ActionablesComponent } from './components/actionables/actionables.component';
import { LoginFormComponent } from './components/login-form/login-form.component';

@Component({
  selector: 'app-before-launch',
  standalone: true,
  imports: [ExampleSliderComponent, ActionablesComponent, LoginFormComponent],
  templateUrl: './before-launch.component.html',
  styleUrl: './before-launch.component.css',
})
export class BeforeLaunchComponent {
  showEntryModal = false

  showModal() {
    this.showEntryModal = true
  }

  hideModal() {
    this.showEntryModal = false
  }
}
