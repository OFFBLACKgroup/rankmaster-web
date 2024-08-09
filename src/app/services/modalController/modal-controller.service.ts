import { Injectable } from '@angular/core';

export enum ModalType {
  howTo,
  login,
  pricing,
  signUpPrompt,
  username_select
}

//OPTIMIZABLE terrible code, can create inclusion with a single variable with options of which modal is open
 // WHAT A TERRIBLE CODE

@Injectable({
  providedIn: 'root'
})
export class ModalControllerService {

  preLaunch = true

  private _activeModal: ModalType | null = null

  public get activeModal() {
    return this._activeModal
  }

  showModal(modalType: ModalType) {
    if (this.preLaunch) { return }
    this._activeModal = modalType
  }

  hideModal() {
    this._activeModal = null
  }
}
