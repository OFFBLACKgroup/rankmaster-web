import { Component, inject } from '@angular/core';
import { HeadlineComponent } from '../../../components/headline/headline.component';
import { TierListComponent } from '../../../components/tier-list/tier-list.component';
import { UserDataService } from '../../../services/userData/user-data.service';

@Component({
  selector: 'app-daily',
  standalone: true,
  imports: [HeadlineComponent, TierListComponent],
  templateUrl: './daily.component.html',
  styleUrl: './daily.component.css'
})
export class DailyComponent {
  userDataService = inject(UserDataService)

  ngOnInit() {
    if (this.userDataService.userData != undefined) { return }
    else {
      // this.userDataService.signInAnonymous().subscribe((res) => )
    }
  }

  title = ''
  setTitle(title: string) {
    this.title = title
  }
}
