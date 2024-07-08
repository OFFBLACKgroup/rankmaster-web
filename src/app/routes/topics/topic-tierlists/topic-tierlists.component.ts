import { Component, OnInit } from '@angular/core';
import { HeadlineComponent } from '../../../components/headline/headline.component';
import { HttpService } from '../../../http-service.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-topic-tierlists',
  standalone: true,
  imports: [HeadlineComponent, MatProgressSpinner],
  templateUrl: './topic-tierlists.component.html',
  styleUrl: './topic-tierlists.component.css'
})
export class TopicTierlistsComponent implements OnInit {
  constructor(
    private _route: ActivatedRoute,
    private _httpService: HttpService
  ) { }

  private sub: Subscription | any; 
  id: string | any;

  ngOnInit(): void {
    this.sub = this._route.params.subscribe(params => {
      this.id = params['id'];

      // sending 'id + 1' as my database is not 0-indexed
      this._httpService.fetchTopicTierlists(Number(params['id']) + 1).subscribe(config => {
        this.topicTierlists = config
        console.log(config)
      });
    });
  }

  topicTierlists: any = []

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  topicTitles = [
    'Sports & Exercise',
    'Video Games',
    'Anime & Manga',
    'Food & Drink',
    'Movies & TV Series',
    'Cars & Vehicles',
    'Books & Literature',
    'Famous People',
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
