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

  private _showHowTo = false
  private _showLogin = false
  private _showPricing = false

  public get showHowTo() {
    return this._showHowTo
  }
  public get showLogin() {
    return this._showLogin
  }
  public get showPricing() {
    return this._showPricing
  }

  private _checkIfStandalone(selected: ModalType) {
    switch (selected) {
      case ModalType.howTo_ON: {

      }
    }
  }

  showModal(modalType: ModalType) {
    switch (modalType) {
      case ModalType.howTo_ON:
        if (this._showLogin) {
          this._showLogin = false
        } else if (this._showPricing) {
          this._showPricing = false
        }
        this._showHowTo = true
        break
      case ModalType.howTo_OFF:
        this._showHowTo = false
        break
      case ModalType.login_ON:
        if (this._showHowTo) {
          this._showHowTo = false
        } else if (this._showPricing) {
          this._showPricing = false
        }
        this._showLogin = true
        break
      case ModalType.login_OFF:
        this._showLogin = false
        break
      case ModalType.pricing_ON:
        if (this._showLogin) {
          this._showLogin = false
        } else if (this._showHowTo) {
          this._showHowTo = false
        }
        this._showPricing = true
        break
      case ModalType.pricing_OFF:
        this._showPricing = false
        break
    }
  }
}
