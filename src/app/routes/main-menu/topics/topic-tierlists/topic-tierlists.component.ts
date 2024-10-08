import { Component, OnInit } from '@angular/core';
import { HeadlineComponent } from '../../../../components/headline/headline.component';
import { TierlistManagerService } from '../../../../services/tierlistManager/tierlist-manager.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { animate, style, transition, trigger } from '@angular/animations';
import { UserManagerService } from '../../../../services/userManager/user-manager.service';

export interface TierList {
  created_at: Date,
  id: number,
  name: string,
  num_of_tiers: number,
  topic_ID: number,
  is_premium: boolean,
  tierlist_items: { count: number }[]
  is_completed: boolean,
  collected_points?: number
}

export interface CompletedTierlist {
  tierlist_ID: number,
  collected_points: number
}

@Component({
  selector: 'app-topic-tierlists',
  standalone: true,
  imports: [HeadlineComponent, MatProgressSpinner, RouterLink],
  templateUrl: './topic-tierlists.component.html',
  styleUrl: './topic-tierlists.component.css',
  animations: [
    trigger('appear', [
      transition(':enter', [
        style({ transform: 'translateY(150%)' }),
        animate('0.3s ease-out', style({ transform: 'translateY(0%)' }))
      ])
    ])
  ]
})
export class TopicTierlistsComponent implements OnInit {
  constructor(
    private _route: ActivatedRoute,
    private tierlistManager: TierlistManagerService,
    private _userManager: UserManagerService
  ) 
  { 
    this.isPremiumUser = this._userManager.isPremiumUser
    this.completedTierlists = this._userManager.userData as CompletedTierlist[]
  }

  completedTierlists
  isPremiumUser?: boolean

  private sub: Subscription | any; 
  id: string | any;

  ngOnInit(): void {

    this.sub = this._route.params.subscribe(params => {
      this.id = params['id'];

      this.tierlistManager.fetchTopic(Number(params['id'])).subscribe(res=> {
        this.topicTierlists = res as TierList[]
        this.topicTierlists.map((tierlist) => {
          this.completedTierlists.forEach((el) => {
            if (el.tierlist_ID == tierlist.id) {
              tierlist.is_completed = true
              tierlist.collected_points = el.collected_points
            }
          })
        })
        this._userManager.getCurrentPremiumTierlists(this.topicTierlists)
        this.topicTierlists.sort(this.compareFn)
      });
    });
  }
  

  compareFn = (a: TierList, b: TierList) => {
    if (this._userManager.isPremiumUser) {
      return a.tierlist_items[0].count - b.tierlist_items[0].count
    } else {
      if (a.is_premium && !b.is_premium) {
        return 1;
      } else if (!a.is_premium && b.is_premium) {
        return -1;
      } else if (!a.is_premium && !b.is_premium) {
        return a.tierlist_items[0].count - b.tierlist_items[0].count;
      } else {
        return a.num_of_tiers - b.num_of_tiers;
      }
    }
  }

  topicTierlists: TierList[] = []

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  topicTitles = [
    'Video Games',
    'Sports & Exercise',
    'Food & Drink',
    'Movies & TV Series',
    'Anime & Manga',
    'Famous People',
    'Books & Literature',
    'Cars & Vehicles',
    'Culture & History'
  ]

  points = 2

  setBackgroundColor(numOfRows: number) {
    if (numOfRows == 3) {
      return '#75F94C'
    } else if (numOfRows == 5) {
      return '#FFF502'
    } else {
      return '#FF3131'
    }
  }
}
