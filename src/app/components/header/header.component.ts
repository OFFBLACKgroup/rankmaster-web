import { animate, animateChild, query, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ModalControllerService, ModalType } from '../../services/modalController/modal-controller.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
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
  ]
})
export class HeaderComponent {
  modalController = inject(ModalControllerService)
  
  showHowTo() {
    this.modalController.showModal(ModalType.howTo_ON)
  }

  showButtons = true

  testFunction() {
    this.showButtons = !this.showButtons
  }


}
