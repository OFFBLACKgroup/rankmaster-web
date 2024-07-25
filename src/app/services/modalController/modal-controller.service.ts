import { Injectable } from '@angular/core';

export enum ModalType {
  howTo_ON,
  howTo_OFF,
  login_ON,
  login_OFF,
  pricing_ON,
  pricing_OFF
}

@Injectable({
  providedIn: 'root'
})
export class ModalControllerService {

  constructor() { }



  private showHowTo = false
  private showLogin = false
  private showPricing = false

  showModal(modalType: ModalType) {
    switch (modalType) {
      case ModalType.howTo_ON:
        this.showHowTo = true
        break
      case ModalType.howTo_OFF:
        this.showHowTo = false
        break
      case ModalType.login_ON:
        this.showLogin = true
        break
      case ModalType.login_OFF:
        this.showLogin = false
        break
      case ModalType.pricing_ON:
        this.showPricing = true
        break
      case ModalType.pricing_OFF:
        this.showPricing = false
        break
    }
  }
}
