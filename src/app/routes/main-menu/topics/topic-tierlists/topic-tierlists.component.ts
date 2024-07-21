import { Component, OnInit } from '@angular/core';
import { HeadlineComponent } from '../../../../components/headline/headline.component';
import { HttpService } from '../../../../http-service.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { animate, style, transition, trigger } from '@angular/animations';
import { UserDataService } from '../../../../user-data.service';

export interface TierList {
  created_at: Date,
  id: number,
  name: string,
  num_of_tiers: number,
  topic_ID: number,
  is_premium: boolean,
  tierlist_items: { count: number }[]
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
    private _httpService: HttpService,
    private _userDataService: UserDataService
  ) 
  { 
    this.isPremiumUser = this._userDataService.isPremiumUser
  }

  isPremiumUser?: boolean

  completed = false

  private sub: Subscription | any; 
  id: string | any;

  ngOnInit(): void {

    this.sub = this._route.params.subscribe(params => {
      this.id = params['id'];

      this._httpService.fetchTopic(Number(params['id'])).subscribe(res=> {
        this.topicTierlists = res as TierList[]
        this._userDataService.getCurrentPremiumTierlists(this.topicTierlists)
        this.topicTierlists.sort(this.compareFn)
      });
    });
  }
  

  compareFn = (a: TierList, b: TierList) => {
    if (this._userDataService.isPremiumUser) {
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
