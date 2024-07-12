import { Component } from '@angular/core';
import { SocialsComponent } from '../../components/socials/socials.component';
import { RouterLink } from '@angular/router';
import { UserDataService } from '../../user-data.service';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [SocialsComponent, RouterLink],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.css'
})
export class MainMenuComponent {
  constructor(private _userDataService: UserDataService) {
    _userDataService.getUserData()
  }
}
