import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, firstValueFrom } from 'rxjs';

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

  fetchTopic(id: number) {
    return this.http.get('https://www.api.rankmaster.click/fetchTopic/' + id)
  }

  fetchTierlist(id: number) {
    return this.http.get('https://www.api.rankmaster.click/fetchTierlist/' + id)
  }

  async signUp(email: string, password: string) {
    return await firstValueFrom(this.http.post('https://www.api.rankmaster.click/signUp/', 
      { email: email, password: password },
      { observe: 'response' }
    ))
  }

  async signIn(email: string, password: string) {
    return await firstValueFrom(this.http.post('https://www.api.rankmaster.click/signIn/', 
      { email: email, password: password },
      { observe: 'response' } 
    ))
  }

  async getUserData() {
    return await firstValueFrom(this.http.get('https://www.api.rankmaster.click/userData/'))
  }
}
