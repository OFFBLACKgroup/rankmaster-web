import { animate, style, transition, trigger } from '@angular/animations';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserManagerService } from '../../services/userManager/user-manager.service';
import { ModalControllerService } from '../../services/modalController/modal-controller.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-username-select',
  standalone: true,
  imports: [FormsModule, MatProgressSpinner],
  templateUrl: './username-select.component.html',
  styleUrl: './username-select.component.css',
  animations: [
    trigger('scale', [
      transition(':enter', [
        style({ transform: 'translateX(-50%) scale(0)' }),
        animate('0.3s ease-out', style({ transform: 'translateX(-50%) scale(1)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(-50%) scale(1)' }),
        animate('0.3s ease-in', style({ transform: 'translateX(-50%) scale(0)' }))
      ])
    ]),
    trigger('button', [
      transition(':enter', [
        style({ transform: 'translateX(0%)', opacity: 0 }),
        animate('0.3s ease-out', style({ transform: 'translateX(75%)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0.3s ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class UsernameSelectComponent {
  modalManager = inject(ModalControllerService)
  userManager = inject(UserManagerService)
  sanckBar = inject(MatSnackBar)

  userIconStrings = new Array(12).fill(0).map((_, i) => `user_icon${i + 1}.png`)
  showIconSelector = false
  selectedIcon?: number
  userName = ''
  isValid = false

  isLoading = false

  selectIcon(index: number) {
    this.selectedIcon = index
  }

  toggleIconSelector() {
    this.showIconSelector = !this.showIconSelector;
  }

  hideIconSelector() {
    if (this.showIconSelector) {
      this.showIconSelector = false
    }
  }

  checkValidity() {
    this.isValid = this.userName.length >= 3 && this.userName.length <= 16
  }

  submit() {
    if (!this.isValid) { return }
    this.isLoading = true
    this.userManager.updateUsername({ username: this.userName, user_icon_ID: this.selectedIcon }).subscribe({
      next: (res: any) => {
        this.isLoading = false
        if (res.message == "OK") {
          this.modalManager.hideModal()
          if (this.selectedIcon) {
          this.userManager.userIconID = this.selectedIcon + 1
        } else {
            this.userManager.userIconID = -1
          }
        }
      },
      error: (err: any) => {
        this.userName = ''
        this.isValid = false
        this.selectedIcon = undefined
        this.isLoading = false
        let snackBarRef = this.sanckBar.open("This username is already taken", "OK", {
          duration: 3000,
          panelClass: ['red-snackbar']
        })
        snackBarRef.onAction().subscribe(() => {
          snackBarRef.dismiss()
        })
      }
    })
  }
}
