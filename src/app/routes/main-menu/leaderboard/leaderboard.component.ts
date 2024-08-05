import { Component, inject } from '@angular/core';
import { HeadlineComponent } from '../../../components/headline/headline.component';
import { LeaderboardService } from '../../../services/leaderboardService/leaderboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [HeadlineComponent],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent {
  leaderboardRef = inject(LeaderboardService)
  
  people = Array(10)
  public leaderboardData: any[] = [];
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
