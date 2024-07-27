import { animate, animateChild, query, state, style, transition, trigger } from '@angular/animations';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ModalControllerService, ModalType } from '../../services/modalController/modal-controller.service';
import { FeedbackComponent } from './feedback/feedback.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, FeedbackComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  animations: [
    trigger('navState', [
      state('showButtons', style({ width: '*' })),
      state('hideButtons', style({ width: '374.25px'})),
      transition('* <=> *', [
        animate('0.3s ease-out'),
        query('@buttonState', animateChild())
      ]) 
    ]),
    trigger('buttonState', [
      state('show', style({ opacity: 1 })),
      state('hide', style({ opacity: 0 })),
      transition('hide => show', [animate('0.2s ease-in-out')]),
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ transform: 'scale(0.6)' }),
        animate('0.3s ease-out', style({ transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('0.2s ease-in', style({ opacity: 0.2 }) )
      ])
    ]),
    trigger('pulse', [
      state('expand', style({ transform: 'scale(0.96)' })),
      state('shrink', style({ transform: 'scale(1.04)' })),
      transition('shrink <=> expand', animate('0.36s ease-in-out'))
    ]),
  ]
})
// TODO header buttons functionality
export class HeaderComponent {
  modalController = inject(ModalControllerService)
  location = inject(Location)

  showFeedbackModal = false
  saleIconState = 'shrink'

  togglePulseState() {
    this.saleIconState = this.saleIconState == 'shrink' ? 'expand' : 'shrink'
  }

  //#region MODAL CONTROLS 
  showHowTo() {
    this.modalController.showModal(ModalType.howTo_ON)
  }
  showPricing() {
    this.modalController.showModal(ModalType.pricing_ON)
  }
  showLogin() {
    this.modalController.showModal(ModalType.login_ON)
  }

  showFeedback() {
    this.showFeedbackModal = true
    setTimeout(() => {
      if (this.showFeedbackModal) {
        this.showFeedbackModal = false
      }
    }, 3000)
  }
  //#endregion

  showButtons = true

  toggleButtons() {
    this.showButtons = !this.showButtons
  }

  goBack(event: Event) {
    event.preventDefault()
    this.location.back()
  }

  goForward(event: Event) {
    event.preventDefault()
    this.location.forward()
  }
}
