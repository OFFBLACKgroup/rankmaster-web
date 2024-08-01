import { animate, animateChild, query, state, style, transition, trigger } from '@angular/animations';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterLink } from '@angular/router';
import { ModalControllerService, ModalType } from '../../services/modalController/modal-controller.service';
import { FeedbackComponent } from './feedback/feedback.component';
import { Location } from '@angular/common';

// TODO Make header buttons work as inteded
  //Buttons appear only when leaving landing
  //Logo takes to main menu when logged in
// TODO Make header stay on top or at least the navigation

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
    trigger('mobileNavScale', [
      transition(':enter', [
        style({ transform: 'scale(0.2)' }),
        animate('0.3s ease-in', style({ transform: 'scale(1)'}))
      ]),
      transition(':leave', [
        animate('0.3s ease-in', style({ transform: 'scale(0)' }))
      ])
    ])
  ]
})
export class HeaderComponent {
  modalController = inject(ModalControllerService)
  location = inject(Location)
  router = inject(Router)

  showFeedbackModal = false
  saleIconState = 'shrink'
  showMobileNav = false

  homeLink = ''

  private history: string[] = []
  private maxHistoryLength = 10

  isBackButtonEnabled = false

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (!this.backNavigation) {
          this.history.push(event.url)
        } else {
          this.backNavigation = false
        }
        if (this.history.length > this.maxHistoryLength) {
          this.history.shift()
        }
        if (this.history.at(-2) == '/') {
          console.log('HSF')
          this.isBackButtonEnabled = false
        } else if (this.isBackButtonEnabled == false) {
          this.isBackButtonEnabled = true
        }
      }
      else if (event instanceof NavigationEnd) {
        if (event.url == '/') {
          if (this.showButtons == true) {
            this.showButtons = false
          }
          if (this.homeLink != '') {
            this.homeLink = ''
          }
        } else {
          if (this.showButtons == false) {
            this.showButtons = true
          }
          if (this.homeLink == '') {
            this.homeLink = '/menu'
          }
        }
      }
    });
  }

  toggleMobileNav() {
    this.showMobileNav = !this.showMobileNav
  }

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

  //#region MOBILE MODALS
  mobileHowTo() {
    this.showMobileNav = false
    this.modalController.showModal(ModalType.howTo_ON)
  }
  mobilePricing() {
    this.showMobileNav = false
    this.modalController.showModal(ModalType.pricing_ON)
  }
  mobileLogin() {
    this.showMobileNav = false
    this.modalController.showModal(ModalType.login_ON)
  }
  //#endregion
  
  
  showButtons = false
  backNavigation = false

  goBack(event: Event) {
    event.preventDefault()
    if (this.history.at(-2) == '/') {
      return
    }
    this.backNavigation = true
    this.history.pop()
    this.location.back()
  }
}
