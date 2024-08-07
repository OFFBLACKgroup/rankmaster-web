import { inject, Injectable } from '@angular/core';
import { Topic } from '../../routes/main-menu/topics/topics.component';
import { TierList } from '../../routes/main-menu/topics/topic-tierlists/topic-tierlists.component';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserManagerService {

  http = inject(HttpClient)

  userData?: any
  isPremiumUser?: boolean
  promptedToSignUp = false
  sessionCompletedTierlists = 0
  isAnonymousUser?: boolean
  currentPremiumTierlistIDs?: number[]
  isDailyComplete = false

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

  signInAnonymous() {
    return this.http.get('https://www.api.rankmaster.click/signInAnonymous/')
  }

  signIn(email: string, password: string) {
    return this.http.post('https://www.api.rankmaster.click/signIn/', 
      { email: email, password: password, anon: { fromAnon: this.isAnonymousUser, data: this.userData } },
      { observe: 'response' } 
    )
  }

  signUp(email: string, password: string) {
    return this.http.post('https://www.api.rankmaster.click/signUp/', 
      { email: email, password: password, anon: { fromAnon: this.isAnonymousUser, data: this.userData } },
      { observe: 'response' }
    )
  }

  getUserData() {
    return this.http.get('https://www.api.rankmaster.click/userData/')
  }

  getUserID() {
    return this.http.get('https://www.api.rankmaster.click/currentUserID/')
  }

  sendEmail(email: string) {
    this.http.post('http://localhost:3000/send', { email: email }, { responseType: 'text' }).subscribe(config => {
      //TODO update snackbar to handle rejections / etc.
    })
  }
}