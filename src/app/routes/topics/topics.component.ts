import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeadlineComponent } from '../../components/headline/headline.component';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [RouterLink, HeadlineComponent],
  templateUrl: './topics.component.html',
  styleUrl: './topics.component.css'
})
export class TopicsComponent {
  topicData = [
    { title: 'Sports & Exercise', coverImage: 'sport.svg' },
    { title: 'Video Games', coverImage: 'videogame.svg' },
    { title: 'Anime & Manga', coverImage: 'anime.svg' },
    { title: 'Food & Drink', coverImage: 'food.svg' },
    { title: 'Movies & TV Series', coverImage: 'movies.svg' },
    { title: 'Cars & Vehicles', coverImage: 'cars.svg' },
    { title: 'Books & Literature', coverImage: 'books.svg' },
    { title: 'Famous People', coverImage: 'celebrities.svg' },
    { title: 'Culture & History', coverImage: 'history.svg' },
  ]
}
