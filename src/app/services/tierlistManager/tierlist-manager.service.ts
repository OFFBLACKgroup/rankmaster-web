import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Prediction } from '../../components/tier-list/tier-list.component';

@Injectable({
  providedIn: 'root'
})
export class TierlistManagerService {

  http = inject(HttpClient)

  fetchMenu() {
    return this.http.get('https://www.api.rankmaster.click/fetchMenu/')
  }

  fetchTopic(id: number) {
    return this.http.get('https://www.api.rankmaster.click/fetchTopic/' + id)
  }

  fetchTierlist(id: number) {
    return this.http.get('https://www.api.rankmaster.click/fetchTierlist/' + id)
  }

  calculatePoints(topicID: number, tierlistID: number, predictions: Prediction[]) {
    const request = {
      topicID,
      tierlistID,
      predictions
    }

    return this.http.post('https://www.api.rankmaster.click/points/', request)
  }

  fetchDailyTierlist() {
    return this.http.get('https://www.api.rankmaster.click/dailyTierlist/')
  }

  fetchRandomTierlist() {
    return this.http.get('https://www.api.rankmaster.click/randomTierlist/')
  }
}
