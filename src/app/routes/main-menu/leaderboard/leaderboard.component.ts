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
      ], { params: { newOffset: '0px' } }),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('300ms ease-out', style({ opacity: 0 }))
      ]),
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

  //OPTIMIZABLE DSA on eval of new item's rank
  evaluateNewItemRank(item: LeaderboardLog) {
    let itemRank = 1
    for (const row of this.topThree) {
      if (row.score > item.score) {
        itemRank++
      } else {
        break
      }
    }
    if (itemRank == 4) {
      for (const row of this.leaderboardData) {
        if (row.score > item.score) {
          itemRank++
        } else {
          break
        }
      }
    }
    item.rank = itemRank
  }

  sortLeaderboard() {
    this.leaderboardData.sort((a, b) => b.score - a.score)
    this.leaderboardData.map((item, index) => item.rank = index + 4)
  }

  sortTopThree() {
    this.topThree.sort((a, b) => b.score - a.score)
    this.topThree.map((item, index) => item.rank = index + 1)
  }

  deleteInLeaderboard(rank: number) {
    this.leaderboardData.splice(rank - 4, 1)
    this.sortLeaderboard()
  }

  deleteInTopThree(rank: number) {
    this.topThree.splice(rank - 1, 1)
    this.sortTopThree()
  }

  insertIntoLeaderboard(rank: number, item: LeaderboardLog) {
    this.leaderboardData.splice(rank - 4, 0, item)
    this.sortLeaderboard()
  }

  insertIntoTopThree(rank: number, item: LeaderboardLog) {
    if (this.topThree.length == 3) {
      const deleted = this.topThree.splice(-1, 1)[0]
      this.insertIntoLeaderboard(4, deleted)
    }
    this.topThree.splice(rank - 1, 0, item)
    this.sortTopThree()
  }

  testInsert() {
    const newItem = { id: '10', rank: 2, username: 'John Doe', score: 100, user_icon: '../../assets/profile icon 1.png' }
    this.insertIntoTopThree(newItem.rank, newItem)
  }

  newItemRank = 10

  floatState = 'up'
  floatReverse() {
    this.floatState = this.floatState === 'up' ? 'down' : 'up'
  }

  topThree: LeaderboardLog[] = [ ]

  public leaderboardData: LeaderboardLog[] = [ ]

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
      payload.rank = 0
      const newItem = payload.new as LeaderboardLog
      this.evaluateNewItemRank(newItem)
      if (payload.eventType == "UPDATE") {
        let oldItem = this.topThree.find(item => item.id == newItem.id) 
        if (oldItem) {
          if (newItem.rank <= 3) {
            this.deleteInTopThree(oldItem.rank)
            this.insertIntoTopThree(newItem.rank, newItem)
          } else {
            this.deleteInTopThree(oldItem.rank)
            this.insertIntoTopThree(3, this.leaderboardData[0])
            this.deleteInLeaderboard(this.leaderboardData[0].rank)
            this.insertIntoLeaderboard(newItem.rank, newItem)
          }
        } else {
          oldItem = this.leaderboardData.find(item => item.id == newItem.id)
          if (oldItem) {
            if (newItem.rank <= 3) {
              this.insertIntoTopThree(newItem.rank, newItem)
              this.deleteInLeaderboard(oldItem.rank)
            } else {
              this.deleteInLeaderboard(oldItem.rank)
              this.insertIntoLeaderboard(newItem.rank, newItem)
            }
          }
        }
      } else if (payload.eventType == "INSERT") {
        if (newItem.rank <= 3) {
          this.insertIntoTopThree(newItem.rank, newItem)
        } else {
          this.insertIntoLeaderboard(newItem.rank, newItem)
        }
      }
    });

    this.leaderboardRef.fetchLeaderboard().then((res: any) => {
      let topThree: LeaderboardLog[] = []
      if (res.data.length > 3) {
        for (const item of res.data.slice(0, 3)) {
          topThree.push({ id: item.id, rank: 0, username: item.username, score: item.total_points, user_icon: item.user_icon })
        }
        for (const item of res.data.slice(3, res.data.length)) {
          this.leaderboardData.push({ id: item.id, rank: 0, username: item.username, score: item.total_points, user_icon: item.user_icon })
        }
      } else {
        for (const item of res.data) {
          this.topThree.push({ id: item.id, rank: 0, username: item.username, score: item.total_points, user_icon: item.user_icon })
        }
      }
      this.sortTopThree()
      this.sortLeaderboard()
    })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
