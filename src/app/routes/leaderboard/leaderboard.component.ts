import { Component } from '@angular/core';
import { HeadlineComponent } from '../../components/headline/headline.component';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [HeadlineComponent],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent {
  people = Array(10)
}
