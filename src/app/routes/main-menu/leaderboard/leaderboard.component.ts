import { Component, inject } from '@angular/core';
import { HeadlineComponent } from '../../../components/headline/headline.component';
import { LeaderboardService } from '../../../services/leaderboardService/leaderboard.service';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

interface LeaderboardLog {
  id: string
  username: string
  score: number
  rank: number,
  user_icon: string
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
        animate('500ms ease', style({ transform: 'translateY({{newOffset}}px)' }))
      ], { params: { newOffset: '0px' } })
    ]),
    trigger('float', [
      transition('void => up', [
        style({ transform: 'translateY(0px)' }),
        animate('500ms ease', style({ transform: 'translateY(-0.25rem)' }))
      ]),
      transition('up => down', [
        style({ transform: 'translateY(-0.25rem)' }),
        animate('500ms ease', style({ transform: 'translateY(0.25rem)' }))
      ]),
      transition('down => up', [
        style({ transform: 'translateY(0.25rem)' }),
        animate('500ms ease', style({ transform: 'translateY(-0.25rem)' }))
      ])
    ]),
    trigger('fade', [
      transition(':increment', [
        style({ opacity: 0 }),
        animate('500ms ease', style({ opacity: 1 }))
      ]),
      transition(':decrement', [
        style({ opacity: 1 }),
        animate('500ms ease', style({ opacity: 0 }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class LeaderboardComponent {
  leaderboardRef = inject(LeaderboardService)

  testTopThree() {
    const temp = this.topThree[0]
    this.topThree[0] = this.topThree[1] 
    this.topThree[1] = temp
  }

  addNew() {
    const newItem = { id: '10', rank: 6, username: 'John Doe', score: 100, user_icon: '../../assets/profile icon 1.png' }

    this.leaderboardData.splice(newItem.rank - 4, 0, newItem)
    for (let i = 3; i < this.leaderboardData.length; i++) {
      this.leaderboardData[i].rank++
    }
  }

  newItemRank = 10

  floatState = 'up'
  floatReverse() {
    this.floatState = this.floatState === 'up' ? 'down' : 'up'
  }

  topThree: LeaderboardLog[] = [
    { id: '1', rank: 1, username: 'Ratuki 43', score: 2430, user_icon: '../../assets/profile icon 2.png' },
    { id: '2', rank: 2, username: 'Jackson', score: 1847, user_icon: '../../assets/profile icon 1.png' },
    { id: '3', rank: 3, username: 'Bill77', score: 1674, user_icon: '../../assets/profile icon 3.png' },
  ]

  public leaderboardData: LeaderboardLog[] = [
      { id: '4', rank: 4, username: 'John Doe', score: 100, user_icon: '../../assets/profile icon 1.png' },
      { id: '5', rank: 5, username: 'Jane Doe', score: 90, user_icon: '../../assets/profile icon 1.png' },
      { id: '6', rank: 6, username: 'John Smith', score: 80, user_icon: '../../assets/profile icon 1.png' },
      { id: '7', rank: 7, username: 'Jane Smith', score: 70, user_icon: '../../assets/profile icon 1.png' },
      { id: '8', rank: 8, username: 'John Doe', score: 60, user_icon: '../../assets/profile icon 1.png' },
      { id: '9', rank: 9, username: 'Jane Doe', score: 50, user_icon: '../../assets/profile icon 1.png' },
  ]

  // new data arrives, might do the following:
    // a) make something in the leaderboard move to the topThree
    // b) make
  // First, we check if the new value makes it into the topThree
    // a) If it does

  test() {
    if (this.leaderboardData[0].rank == 4) {
      this.leaderboardData[0].rank = 5
      this.leaderboardData[1].rank = 4
    } else {
      this.leaderboardData[0].rank = 4
      this.leaderboardData[1].rank = 5  
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
