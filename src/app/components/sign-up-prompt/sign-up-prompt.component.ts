import { Component, inject } from '@angular/core';
import { ModalControllerService, ModalType } from '../../services/modalController/modal-controller.service';

@Component({
  selector: 'app-sign-up-prompt',
  standalone: true,
  imports: [],
  templateUrl: './sign-up-prompt.component.html',
  styleUrl: './sign-up-prompt.component.css'
})
export class SignUpPromptComponent {
  modalController = inject(ModalControllerService);

  closeModal() {
    this.modalController.hideModal()
  }

  openSignUp() {
    this.modalController.showModal(ModalType.login)
  }
}
