import { Component, inject } from '@angular/core';
import { HeadlineComponent } from '../../../components/headline/headline.component';
import { TierListComponent } from '../../../components/tier-list/tier-list.component';
import { UserManagerService } from '../../../services/userManager/user-manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-daily',
  standalone: true,
  imports: [HeadlineComponent, TierListComponent],
  templateUrl: './daily.component.html',
  styleUrl: './daily.component.css'
})
export class DailyComponent {
  userManager = inject(UserManagerService)
  router = inject(Router)

  ngOnInit() {
    if (this.userManager.isDailyComplete) {
      this.router.navigate(['/menu'])
    }
  }

  title = ''
  setTitle(title: string) {
    this.title = title
  }
}
