import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeadlineComponent } from '../../components/headline/headline.component';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [RouterLink, HeadlineComponent],
  templateUrl: './levels.component.html',
  styleUrl: './levels.component.css'
})
export class LevelsComponent {
}
