import { animate, animateChild, query, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { TierlistManagerService } from '../../services/tierlistManager/tierlist-manager.service';
import { ModalControllerService, ModalType } from '../../services/modalController/modal-controller.service';
import { UserManagerService } from '../../services/userManager/user-manager.service';

@Component({
  selector: 'app-pricing-modal',
  standalone: true,
  imports: [],
  templateUrl: './pricing-modal.component.html',
  styleUrl: './pricing-modal.component.css',
  animations: [
    trigger('rotateIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'rotate(-20deg) translate(10%, 25%) scale(0.8)' }),
        animate('0.2s 1s ease-in', style({ opacity: 1, transform: 'rotate(0) translate(10%, 0%) scale(1)' }))
      ])
    ])
  ]
})
export class PricingModalComponent {
  private userManager = inject(UserManagerService)
  modalController = inject(ModalControllerService)

  userId?: string

  ngOnInit() {
    this.userManager.getUserID().subscribe( (res) => {
      this.userId = res as string
    })
  }

  linkDirection = 'https://buy.stripe.com/7sI4jq4feb1nfO8000?client_reference_id='

  closeModal() {
    this.modalController.showModal(ModalType.pricing_OFF)
  }
}
