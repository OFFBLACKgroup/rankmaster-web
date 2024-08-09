import { animate, animateChild, query, state, style, transition, trigger } from '@angular/animations';
import { Component, inject } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterLink } from '@angular/router';
import { ModalControllerService, ModalType } from '../../services/modalController/modal-controller.service';
import { FeedbackComponent } from './feedback/feedback.component';
import { Location } from '@angular/common';
import { UserManagerService } from '../../services/userManager/user-manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';

// MAYBE Header mobile-nav button, user settings button stay on top

enum SignInState {
  initial,
  iconSelector,
  settings
}

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
        style({ transform: 'scale(0.5)' }),
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
  userManager = inject(UserManagerService)
  snackBar = inject(MatSnackBar)
  SignInState = SignInState
  selectedIcon = -1

  showFeedbackModal = false
  signInState = SignInState.initial
  saleIconState = 'shrink'
  showMobileNav = false

  userIconStrings = new Array(12).fill(0).map((_, i) => `user_icon${i + 1}.png`)


  homeLink = ''

  private history: string[] = []
  private maxHistoryLength = 10

  isBackButtonEnabled = false

  //MAYBE have to optimize on back button functionality at unauthorized

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
        } else if (event.url == '/unauthorized/403' || event.url == '/unauthorized/401') {
          if (this.showButtons == false) {
            this.showButtons = true
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
    this.modalController.showModal(ModalType.howTo)
  }
  showPricing() {
    this.modalController.showModal(ModalType.pricing)
  }

  //OPTIMIZABLE user settings modals with enum probably
  settingsTimeout: NodeJS.Timeout | undefined
  
  showLogin() {
    if (this.userManager.userIconID != undefined) {
      if (this.signInState == SignInState.initial) {
        this.signInState = SignInState.settings
        this.settingsTimeout = setTimeout(() => {
          this.signInState = SignInState.initial
        }, 3000)
      } else if (this.signInState == SignInState.settings) {
        if (this.settingsTimeout) {
          clearTimeout(this.settingsTimeout)
          console.log('settings timeout cleared')
        }
        this.signInState = SignInState.iconSelector
      } else if (this.signInState == SignInState.iconSelector) {
        this.signInState = SignInState.initial
      }
    } else {
      this.modalController.showModal(ModalType.login)
    }
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
    this.modalController.showModal(ModalType.howTo)
  }
  mobilePricing() {
    this.showMobileNav = false
    this.modalController.showModal(ModalType.pricing)  
  }
  mobileLogin() {
    this.showMobileNav = false
    this.modalController.showModal(ModalType.login)
  }
  //#endregion
  
  
  showButtons = false
  backNavigation = false

  goBack(event: Event) {
    event.preventDefault()
    if (!this.showButtons) return
    if (this.history.at(-2) == '/') {
      return
    }
    this.backNavigation = true
    this.history.pop()
    this.location.back()
  }

  //#region ICON SELECTOR
  iconSelectorTimeout: NodeJS.Timeout | undefined

  hideIconSelector() {
    this.iconSelectorTimeout = setTimeout(() => {
      this.userManager.updateUserIcon(this.selectedIcon + 1).subscribe({
        next: () => {
        },
        error: (error) => {
          this.snackBar.open(`Error updating user icon: ${error.error}`, 'Dismiss', { duration: 3000 })
        }
      })
      this.signInState = SignInState.initial
    }, 1000)
  }

  reenterIconSelector() {
    if (this.iconSelectorTimeout) {
      clearTimeout(this.iconSelectorTimeout)
    }
  }
  //#endregion
}
