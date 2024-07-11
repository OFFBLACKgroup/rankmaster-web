import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeadlineComponent } from '../../../components/headline/headline.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { trigger, animate, transition, style } from '@angular/animations';

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
        animate("0.2s ease-out", style({ transfrom: "scale(1)" })),
      ]),
    ])
  ]

})
export class TopicsComponent {
  constructor() {
    preloadImages(this.topicData.map(item => item.coverImage), this.loadingData)
  }

  loadingData = {
    areImagesLoaded: false,
    numOfLoaded: 0
  }

  topicData = [
    { 
      title: 'Sports & Exercise', 
      coverImage: 'https://pubhndccqdwypcouejkh.supabase.co/storage/v1/object/public/rankmaster/topic_images/sport.svg', 
      id: 2 
    },
    { 
      title: 'Video Games', 
      coverImage: 'https://pubhndccqdwypcouejkh.supabase.co/storage/v1/object/public/rankmaster/topic_images/videogame.svg', 
      id: 1 },
    { 
      title: 'Anime & Manga', 
      coverImage: 'https://pubhndccqdwypcouejkh.supabase.co/storage/v1/object/public/rankmaster/topic_images/anime.svg', 
      id: 5 },
    { 
      title: 'Food & Drink', 
      coverImage: 'https://pubhndccqdwypcouejkh.supabase.co/storage/v1/object/public/rankmaster/topic_images/food.svg', 
      id: 3 },
    { 
      title: 'Movies & TV Series', 
      coverImage: 'https://pubhndccqdwypcouejkh.supabase.co/storage/v1/object/public/rankmaster/topic_images/movies.svg', 
      id: 4 },
    { 
      title: 'Cars & Vehicles', 
      coverImage: 'https://pubhndccqdwypcouejkh.supabase.co/storage/v1/object/public/rankmaster/topic_images/cars.svg', 
      id: 8 },
    { 
      title: 'Books & Literature', 
      coverImage: 'https://pubhndccqdwypcouejkh.supabase.co/storage/v1/object/public/rankmaster/topic_images/books.svg', 
      id: 7 },
    { 
      title: 'Famous People', 
      coverImage: 'https://pubhndccqdwypcouejkh.supabase.co/storage/v1/object/public/rankmaster/topic_images/celebrities.svg', 
      id: 6 },
    { 
      title: 'Culture & History', 
      coverImage: 'https://pubhndccqdwypcouejkh.supabase.co/storage/v1/object/public/rankmaster/topic_images/history.svg', 
      id: 9 },
  ]
}
