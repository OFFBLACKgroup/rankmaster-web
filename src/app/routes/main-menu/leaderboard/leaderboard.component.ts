import { Component, inject } from '@angular/core';
import { HeadlineComponent } from '../../../components/headline/headline.component';
import { LeaderboardService } from '../../../services/leaderboardService/leaderboard.service';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

interface LeaderboardLog {
  id: string
  username: string
  total_points: number
  user_icon_ID: number
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
        style({ opacity: 0, transform: 'translateY({{newOffset}}px) scale(0.5)' }),
        animate('500ms ease', style({ opacity: 1, transform: 'translateY({{newOffset}}px) scale(1)' }))
      ], { params: { newOffset: '0px' } })
    ])
  ]
})
export class LeaderboardComponent {
  leaderboardManager = inject(LeaderboardService)
  newItemRank = -1
  leaderboardData: LeaderboardLog[] = []
  get extendedLeaderboard(): LeaderboardLog[] {
    return this.leaderboardData.filter(item => item.rank > 3)
  }
  get firstPlace(): LeaderboardLog {
    return this.leaderboardData.filter(item => item.rank == 1)[0]
  }
  get secondPlace(): LeaderboardLog {
    return this.leaderboardData.filter(item => item.rank == 2)[0]
  }
  get thirdPlace(): LeaderboardLog {
    return this.leaderboardData.filter(item => item.rank == 3)[0]
  }


  evaluateNewItemPostion(item: LeaderboardLog) {
    let rank = 1
    const sortedData = this.leaderboardData.slice().sort((a, b) => a.rank - b.rank)
    for (const row of sortedData) {
      if (row.total_points > item.total_points) {
        rank++
      } else {
        break
      }
    }
    this.newItemRank = rank
    item.rank = rank
  }

  //#region CROWN ANIMATION
  floatState = 'up'
  floatReverse() {
    this.floatState = this.floatState === 'up' ? 'down' : 'up'
  }
  //#endregion

  private subscription?: Subscription;

  updateLeaderboard(newItem: LeaderboardLog) {
    let oldItem = this.leaderboardData.find(item => item.id == newItem.id)
    if (oldItem) {
      if (oldItem.rank < newItem.rank) {
        console.log("Error: Can't decrease points")
        return
      } else {
        let lastID = ""
        for (let i = newItem.rank; i < oldItem.rank; i++) {
          const itemBetweenID = this.leaderboardData.findIndex(item => item.rank == i && item.id != lastID)
          if (itemBetweenID != -1) {
            lastID = this.leaderboardData[itemBetweenID].id
            this.leaderboardData[itemBetweenID].rank += 1
          }
        }
      } 
      oldItem.rank = newItem.rank
      oldItem.total_points = newItem.total_points
    }
  }

  insertIntoLeaderboard(item: LeaderboardLog) {
    this.leaderboardData.push(item)
    let lastID = ""
    for (let i = item.rank; i < this.leaderboardData.length; i++) {
      const itemToUpdate = this.leaderboardData.find(item => item.rank == i && item.id != lastID)
      if (itemToUpdate) {
        itemToUpdate.rank += 1
        lastID = itemToUpdate.id
      }
    }
  }

  createRealtimeConnection() {
    this.subscription = this.leaderboardManager.leaderboardChanges.subscribe((payload) => {
      const newItem = payload.new as LeaderboardLog
      this.evaluateNewItemPostion(newItem) 
      if (payload.eventType == "UPDATE") {
        this.updateLeaderboard(newItem)
      } else if (payload.eventType == "INSERT") {
        this.insertIntoLeaderboard(newItem)
      }
    })
  }

  async fetchInitialLeaderboard() {
    const data = await this.leaderboardManager.fetchLeaderboard() as LeaderboardLog[]
    data.forEach((item, index) => { item.rank = index + 1 })
    data.forEach((item) => {
      this.leaderboardData.push(item)
    });
  }
  
  async ngOnInit() {
    this.fetchInitialLeaderboard()
    this.createRealtimeConnection()
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
