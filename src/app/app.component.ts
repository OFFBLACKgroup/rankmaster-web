import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderSimplifiedComponent } from './shared/header-simplified/header-simplified.component';
import { BeforeLaunchComponent } from './routes/before-launch/before-launch.component';
import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderSimplifiedComponent, BeforeLaunchComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'rankmaster';
}
