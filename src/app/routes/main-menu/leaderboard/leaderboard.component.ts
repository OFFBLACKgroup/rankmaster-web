import { Component, inject } from '@angular/core';
import { HeadlineComponent } from '../../../components/headline/headline.component';
import { LeaderboardService } from '../../../services/leaderboardService/leaderboard.service';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

interface LeaderboardLog {
  id: string
  username: string
  score: number
  rank: number
}

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [HeadlineComponent],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(60vh)' }),
        animate('600ms ease-out', style({ transform: 'translateY(0%)' }))
      ])
    ]),
    trigger('moveAnimation', [
      transition(':increment', [
        animate('500ms ease', style({ transform: 'translateY({{newOffset}}px)' }))
      ], { params: { newOffset: '0px' }}),
      transition(':decrement', [
        animate('500ms ease', style({ transform: 'translateY({{newOffset}})' }))
      ], { params: { newOffset: '0px' } })
    ])
  ]
})
export class LeaderboardComponent {
  leaderboardRef = inject(LeaderboardService)

  public leaderboardData: LeaderboardLog[] = [
      { id: '1', rank: 1, username: 'John Doe', score: 100 },
      { id: '2', rank: 2, username: 'Jane Doe', score: 90 },
      { id: '3', rank: 3, username: 'John Smith', score: 80 },
      { id: '4', rank: 4, username: 'Jane Smith', score: 70 },
      { id: '5', rank: 5, username: 'John Doe', score: 60 },
      { id: '6', rank: 6, username: 'Jane Doe', score: 50 },
  ]

  test() {
    if (this.leaderboardData[0].rank == 2) {
      this.leaderboardData[0].rank = 1
      this.leaderboardData[1].rank = 2
    } else {
      this.leaderboardData[0].rank = 2
      this.leaderboardData[1].rank = 1
    }
  }

  private subscription?: Subscription;
  
  ngOnInit() {
    this.subscription = this.leaderboardRef.leaderboardChanges.subscribe((payload) => {
      console.log('Leaderboard update:', payload);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
