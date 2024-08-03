import { Component, inject } from '@angular/core';
import { HeadlineComponent } from '../../../components/headline/headline.component';
import { TierListComponent } from '../../../components/tier-list/tier-list.component';
import { UserManagerService } from '../../../services/userManager/user-manager.service';

@Component({
  selector: 'app-daily',
  standalone: true,
  imports: [HeadlineComponent, TierListComponent],
  templateUrl: './daily.component.html',
  styleUrl: './daily.component.css'
})
export class DailyComponent {
  userManager = inject(UserManagerService)

  ngOnInit() {
    if (this.userManager.userData != undefined) { return }
    else {
      // this.userManager.signInAnonymous().subscribe((res) => )
    }
  }

  title = ''
  setTitle(title: string) {
    this.title = title
  }
}
