import { Component, OnInit } from '@angular/core';
import { HeadlineComponent } from '../../../components/headline/headline.component';
import { HttpService } from '../../../http-service.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-topic-tierlists',
  standalone: true,
  imports: [HeadlineComponent],
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
      this._httpService.fetchTopicTierlists(params['id'] + 1).subscribe(config => {
        this.topicTierlists = config
        console.log(this.topicTierlists)
      });
    });
  }

  topicTierlists: any

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  topicData = [
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

}
