import { animate, animateChild, keyframes, query, style, transition, trigger } from '@angular/animations';
import { CUSTOM_ELEMENTS_SCHEMA, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { PricingModalComponent } from '../../components/pricing-modal/pricing-modal.component';
import { ModalControllerService, ModalType } from '../../services/modalController/modal-controller.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.css',
  animations: [
    trigger('cursorMovement', [
      transition(':enter', [
        animate('2s 1.5s ease-in-out', 
          keyframes([
            style({ opacity: 1, left: '0%', offset: 0.1 }),
            style({ opacity: 1, left: '100%', offset: 1 })
          ])
        )
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ transform: 'scale(0.6)' }),
        animate('0.3s ease-in-out', style({ transform: 'scale(1)' })),
        query('@rotateIn', animateChild())
      ])
    ])
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UnauthorizedComponent {
  route = inject(ActivatedRoute)
  modalController = inject(ModalControllerService)

  routeId?: string | null

  navigation = true
  errorText = ['Oops... seems like', 'something went wrong']
  buttonText = 'Return'
  buttonUppercase = true
  linkTo = ''
  showingModal = false

  ngOnInit() {
    this.routeId = this.route.snapshot.paramMap.get('id');
    if (this.routeId) {
      switch (this.routeId) {
        case '401':
          this.errorText = ['Seems like you are not', 'logged in yet...']
          this.buttonText = 'Log In'
          this.buttonUppercase = false
          this.navigation = false
          break
        case '403':
          this.errorText = ['Sorry, you do not have', 'access to this page...']
          this.buttonText = 'Go Premium'
          this.navigation = false
          break
      } 
    }
  }

  clickFunction() {
    if (this.routeId == '401') {
      this.modalController.showModal(ModalType.login)
    } else if (this.routeId == '403') {
      this.modalController.showModal(ModalType.pricing)
    }
  }
}
