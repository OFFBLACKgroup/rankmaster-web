import { Component } from '@angular/core';
import { HeadlineComponent } from '../../components/headline/headline.component';

@Component({
  selector: 'app-daily',
  standalone: true,
  imports: [HeadlineComponent],
  templateUrl: './daily.component.html',
  styleUrl: './daily.component.css'
})
export class DailyComponent {

}
