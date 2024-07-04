import { Component } from '@angular/core';

@Component({
  selector: 'app-tier-list',
  standalone: true,
  imports: [],
  templateUrl: './tier-list.component.html',
  styleUrl: './tier-list.component.css'
})
export class TierListComponent {
  tiers = ['S', 'A', 'B', 'C', 'D', 'E', 'F']
  backgroundColors = ['#FF3131', '#FF7518', '#FFBF00', '#32CD32', '#00FFFF', '#1F51FF', '#DA70D6']
}
