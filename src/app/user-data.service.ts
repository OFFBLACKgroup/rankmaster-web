import { Injectable } from '@angular/core';
import { HttpService } from './http-service.service';
import { Topic } from './routes/main-menu/topics/topics.component';
import { TierList } from './routes/main-menu/topics/topic-tierlists/topic-tierlists.component';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private _httpService: HttpService) { }

  userData?: any
  isPremiumUser?: boolean
  currentPremiumTierlistIDs?: number[]

  getCompletedTierlists(topicData: Topic[]) {
    if (this.userData != undefined) {
      this.userData.forEach((tierlist: any) => {
        const id = topicData.findIndex(el => el.id == tierlist.topic_ID)
        topicData[id].completedTierlists += 1
      })
    } 
  }

  getCurrentPremiumTierlists(tierlists: TierList[]) {
    this.currentPremiumTierlistIDs = tierlists.reduce((newArr: number[], tierlist) => {
      if (tierlist.is_premium) {
        newArr.push(tierlist.id)
      }
      return newArr
    }, [])
  }
}
