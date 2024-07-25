import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeadlineComponent } from '../../../components/headline/headline.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { trigger, animate, transition, style } from '@angular/animations';
import { UserDataService } from '../../../services/userData/user-data.service';
import { HttpService } from '../../../services/http-service.service';

export function preloadImages(imageSources: string[], loadingData: {areImagesLoaded: boolean, numOfLoaded: number}) {
  for (const source of imageSources) {
    const img = new Image()
    img.onload = () => {
      loadingData.numOfLoaded += 1
      if (loadingData.numOfLoaded == imageSources.length) {
        loadingData.areImagesLoaded = true
      }
    }
    img.src = source
  }
}

export interface Topic {
  id: number;
  name: string;
  coverImagePath: string;
  tierlists: { count: number }[];
  completedTierlists: number;
}

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [RouterLink, HeadlineComponent, MatProgressSpinner],
  templateUrl: './topics.component.html',
  styleUrl: './topics.component.css',
  animations: [
    trigger('appear', [
      transition(":enter", [
        style({ transform: "scale(0.8)" }),
        animate("0.2s ease-out", style({ transform: "scale(1)" })),
      ]),
    ])
  ]

})
export class TopicsComponent {
  constructor(_userDataService: UserDataService, _httpService: HttpService) {
    _httpService.fetchMenu().subscribe( (res: any) => {
        res.map( (item: any) => item.completedTierlists = 0)
        this.topics = res as Topic[]
        preloadImages(this.topics.map(item => item.coverImagePath), this.loadingData)
        _userDataService.getCompletedTierlists(this.topics)
      }
    )
  }

  loadingData = {
    areImagesLoaded: false,
    numOfLoaded: 0
  }

  topics?: Topic[]
}
