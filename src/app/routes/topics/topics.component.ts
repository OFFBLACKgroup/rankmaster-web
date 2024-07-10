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
    { title: 'Sports & Exercise', coverImage: 'sport.svg', id: 2 },
    { title: 'Video Games', coverImage: 'videogame.svg', id: 1 },
    { title: 'Anime & Manga', coverImage: 'anime.svg', id: 5 },
    { title: 'Food & Drink', coverImage: 'food.svg', id: 3 },
    { title: 'Movies & TV Series', coverImage: 'movies.svg', id: 4 },
    { title: 'Cars & Vehicles', coverImage: 'cars.svg', id: 8 },
    { title: 'Books & Literature', coverImage: 'books.svg', id: 7 },
    { title: 'Famous People', coverImage: 'celebrities.svg', id: 6 },
    { title: 'Culture & History', coverImage: 'history.svg', id: 9 },
  ]
}
