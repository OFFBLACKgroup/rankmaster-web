import { Injectable } from '@angular/core';
import { HttpService } from './http-service.service';
import { Topic } from './routes/main-menu/topics/topics.component';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private _httpService: HttpService) { }

  userData?: any

  async getUserData() {
    this.userData = await this._httpService.getUserData()
  }

  getCompletedTierlists(topicData: Topic[]) {
    if (this.userData != undefined) {
      this.userData.forEach((tierlist: any) => {
        const id = topicData.findIndex(el => el.id == tierlist.topic_ID)
        topicData[id].completedTierlists += 1
      })
    } 
  }
}
