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
}
