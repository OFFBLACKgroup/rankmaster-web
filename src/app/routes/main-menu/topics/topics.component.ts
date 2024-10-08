import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeadlineComponent } from '../../../components/headline/headline.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { trigger, animate, transition, style } from '@angular/animations';
import { UserManagerService } from '../../../services/userManager/user-manager.service';
import { TierlistManagerService } from '../../../services/tierlistManager/tierlist-manager.service';

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
  constructor(_userManager: UserManagerService, tierlistManager: TierlistManagerService) {
    tierlistManager.fetchMenu().subscribe( (res: any) => {
        res.map( (item: any) => item.completedTierlists = 0)
        this.topics = res as Topic[]
        preloadImages(this.topics.map(item => item.coverImagePath), this.loadingData)
        _userManager.getCompletedTierlists(this.topics)
      }
    )
  }

  loadingData = {
    areImagesLoaded: false,
    numOfLoaded: 0
  }

  topics?: Topic[]
}
