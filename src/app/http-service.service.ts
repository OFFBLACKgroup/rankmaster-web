import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient ) { }

  sendEmail(email: string) {
    this.http.post('http://localhost:3000/send', { email: email }, { responseType: 'text' }).subscribe(config => {
      console.log('Updated config:', config);
    });
  }

  fetchMenu() {
    return this.http.get('https://www.api.rankmaster.click/fetchMenu/')
  }

  fetchTopic(id: number) {
    return this.http.get('https://www.api.rankmaster.click/fetchTopic/' + id)
  }

  fetchTierlist(id: number) {
    return this.http.get('https://www.api.rankmaster.click/fetchTierlist/' + id)
  }

  signUp(email: string, password: string) {
    return this.http.post('https://www.api.rankmaster.click/signUp/', 
      { email: email, password: password },
      { observe: 'response' }
    )
  }

  signIn(email: string, password: string) {
    return this.http.post('https://www.api.rankmaster.click/signIn/', 
      { email: email, password: password },
      { observe: 'response' } 
    )
  }

  getUserData() {
    return this.http.get('https://www.api.rankmaster.click/userData/')
  }
}
