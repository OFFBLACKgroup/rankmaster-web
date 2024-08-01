import { Component } from '@angular/core';
import { HeadlineComponent } from '../../../components/headline/headline.component';
import { TierListComponent } from '../../../components/tier-list/tier-list.component';

@Component({
  selector: 'app-daily',
  standalone: true,
  imports: [HeadlineComponent, TierListComponent],
  templateUrl: './daily.component.html',
  styleUrl: './daily.component.css'
})
export class DailyComponent {
  //MAYBE wait for title load before displaying
  title = ''
  setTitle(title: string) {
    this.title = title
  }
}
