import { Injectable } from '@angular/core';
import { Topic } from '../../routes/main-menu/topics/topics.component';
import { TierList } from '../../routes/main-menu/topics/topic-tierlists/topic-tierlists.component';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private http: HttpClient) { }

  userData?: any
  isPremiumUser?: boolean
  isAnonymousUser?: boolean
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

  //TODO fix random tier list fetching for anon
  signInAnonymous() {
    return this.http.get('https://www.api.rankmaster.click/signInAnonymous/')
  }
}