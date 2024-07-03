import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-headline',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './headline.component.html',
  styleUrl: './headline.component.css'
})
export class HeadlineComponent {
  @Input() title = "Headline"
}
