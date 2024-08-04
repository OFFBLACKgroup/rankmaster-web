import { Component, inject } from '@angular/core';
import { SocialsComponent } from '../../components/socials/socials.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserManagerService } from '../../services/userManager/user-manager.service';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [SocialsComponent, RouterLink, RouterLinkActive],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.css'
})
export class MainMenuComponent {
  userManager = inject(UserManagerService)
  currentDay = new Date().getDate()
  currentMonth = new Date().toLocaleString('en-US', { month: 'short' })

  isDailyComplete = false

  ngOnInit() {
    if (this.userManager.isDailyComplete) {
      this.isDailyComplete = true
    }
  }
}
