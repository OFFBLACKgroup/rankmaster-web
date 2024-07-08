import { Component, Input } from '@angular/core';
import { HeadlineComponent } from '../../../components/headline/headline.component';
import { HttpService } from '../../../http-service.service';

@Component({
  selector: 'app-topic-tierlists',
  standalone: true,
  imports: [HeadlineComponent],
  templateUrl: './topic-tierlists.component.html',
  styleUrl: './topic-tierlists.component.css'
})
export class TopicTierlistsComponent {
  constructor (private http: HttpService) {}

  @Input() title = 'Tier lists'

  points = 2

  tierLists = [0,0,0,0,0,0,0,0,0]
}
