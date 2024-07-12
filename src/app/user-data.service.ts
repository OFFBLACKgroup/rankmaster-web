import { Injectable } from '@angular/core';
import { HttpService } from './http-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private _httpService: HttpService) { }

  userData?: any

  async getUserData() {
    this._httpService.getUserData().subscribe((data) => {
      this.userData = data
    })
  }
}
