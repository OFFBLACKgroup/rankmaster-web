import { Component } from '@angular/core';
import { ExampleSliderComponent } from './components/example-slider/example-slider.component';
import { ActionablesComponent } from './components/actionables/actionables.component';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { PlayInvitationComponent } from './components/play-invitation/play-invitation.component';
import { animate, animateChild, query, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-before-launch',
  standalone: true,
  imports: [ExampleSliderComponent, ActionablesComponent, LoginFormComponent, PlayInvitationComponent],
  templateUrl: './before-launch.component.html',
  styleUrl: './before-launch.component.css',
  animations: [
  ]
})
export class BeforeLaunchComponent {
  showEntryModal = false
  preLaunch = true

  launch() {
    this.preLaunch = false
  }
}
