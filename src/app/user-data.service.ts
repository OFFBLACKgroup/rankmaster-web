import { Injectable } from '@angular/core';
import { HttpService } from './http-service.service';
import { Topic } from './routes/main-menu/topics/topics.component';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private _httpService: HttpService) { }

  userData?: any

  getCompletedTierlists(topicData: Topic[]) {
    if (this.userData != undefined) {
      this.userData.forEach((tierlist: any) => {
        const id = topicData.findIndex(el => el.id == tierlist.topic_ID)
        topicData[id].completedTierlists += 1
      })
    } 
  }
}
