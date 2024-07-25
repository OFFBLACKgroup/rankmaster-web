import { Component } from '@angular/core';

@Component({
  selector: 'app-how-to',
  standalone: true,
  imports: [],
  templateUrl: './how-to.component.html',
  styleUrl: './how-to.component.css'
})
export class HowToComponent {
  steps = ['Read the Topic of the tier list:', 'You are shown items one by one', 'Place them in tiers', 'Compare with the community!']
}
