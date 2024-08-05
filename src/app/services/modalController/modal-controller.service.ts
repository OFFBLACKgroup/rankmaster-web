import { Injectable } from '@angular/core';

export enum ModalType {
  howTo_ON,
  howTo_OFF,
  login_ON,
  login_OFF,
  pricing_ON,
  pricing_OFF,
  signUpPrompt_ON,
  signUpPrompt_OFF
}

//OPTIMIZABLE terrible code, can create inclusion with a single variable with options of which modal is open
 // WHAT A TERRIBLE CODE

@Injectable({
  providedIn: 'root'
})
export class ModalControllerService {

  preLaunch = false

  private _showHowTo = false
  private _showLogin = false
  private _showPricing = false
  private _showSignUpPrompt = false

  public get showHowTo() {
    return this._showHowTo
  }
  public get showLogin() {
    return this._showLogin
  }
  public get showPricing() {
    return this._showPricing
  }
  public get showSignUpPrompt() {
    return this._showSignUpPrompt
  }

  showModal(modalType: ModalType) {
    if (this.preLaunch) { return }
    switch (modalType) {
      case ModalType.howTo_ON:
        if (this._showLogin) {
          this._showLogin = false
        } else if (this._showPricing) {
          this._showPricing = false
        } else if (this._showSignUpPrompt) {
          this._showSignUpPrompt = false
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
        } else if (this._showSignUpPrompt) {
          this._showSignUpPrompt = false
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
        } else if (this._showSignUpPrompt) {
          this._showSignUpPrompt = false
        }
        this._showPricing = true
        break
      case ModalType.pricing_OFF:
        this._showPricing = false
        break
      case ModalType.signUpPrompt_ON:
        if (this._showLogin) {
          this._showLogin = false
        } else if (this._showHowTo) {
          this._showHowTo = false
        } else if (this._showPricing) {
          this._showPricing = false
        }
        this._showSignUpPrompt = true
        break
      case ModalType.signUpPrompt_OFF:
        this._showSignUpPrompt = false
        break
    }
  }
}
