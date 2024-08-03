import { Component } from '@angular/core';
import { HeadlineComponent } from '../../../../../components/headline/headline.component';
import { ActivatedRoute } from '@angular/router';
import { TierlistManagerService } from '../../../../../services/tierlistManager/tierlist-manager.service';
import { Subscription } from 'rxjs';
import { TierListComponent, MarkerColor } from '../../../../../components/tier-list/tier-list.component';
import { animate, style, transition, trigger } from '@angular/animations';

export interface TierListItem {
  id: number,
  created_at: Date,
  tierlist_ID: number,
  name: string,
  background_color: string,
  num_of_votes: number,
  average_rank: number,
  file_path: string,
  result_marker_color?: MarkerColor,
  flip_marker?: boolean
} 

@Component({
  selector: 'app-play-tierlist',
  standalone: true,
  imports: [HeadlineComponent, TierListComponent],
  templateUrl: './play-tierlist.component.html',
  styleUrl: './play-tierlist.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ])
    ])
  ]
})
export class PlayTierlistComponent {
  constructor(
    private _route: ActivatedRoute,
    private tierlistManager: TierlistManagerService
  ) { }

  private sub: Subscription | any
  id: string | any
  title: string | null = null

  ngOnInit(): void {
    this.sub = this._route.params.subscribe(params => {
      this.id = params['id'];
      this.tierlistManager.fetchTierlist(Number(params['id'])).subscribe(config=> {
        this.tierlistItems = config as TierListItem[]
        this.tierlistItems.sort(() => Math.random() - 0.5)
        this.title = this._route.snapshot.paramMap.get('title')
      });
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  
  tierlistItems: TierListItem[] = []
}
