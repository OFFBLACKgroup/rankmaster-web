import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { SocialsComponent } from '../../../../components/socials/socials.component';
import { FormsModule } from '@angular/forms';
import {MatProgressSpinner } from '@angular/material/progress-spinner';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginFormComponent } from '../../../../components/login-form/login-form.component';
import { UserManagerService } from '../../../../services/userManager/user-manager.service';
import confetti from 'canvas-confetti'
import { ModalControllerService } from '../../../../services/modalController/modal-controller.service';

@Component({
  selector: 'app-actionables',
  standalone: true,
  imports: [FormsModule, SocialsComponent, MatProgressSpinner, LoginFormComponent],
  templateUrl: './actionables.component.html',
  styleUrl: './actionables.component.css',
  animations: [
    trigger("fadeIn", [
      transition(":enter", [
        style({ opacity: "0" }),
        animate("0.2s 0.1s ease-out", style({ opacity: "1" })),
      ]),
    ])
  ]
})
export class ActionablesComponent {
  userManager = inject(UserManagerService) 
  _snackBar = inject(MatSnackBar)
  modalController = inject(ModalControllerService)
  @Output() launch = new EventEmitter()

  emit() {
    this.launch.emit()
  }

  launchConfetti() {
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6, x: 0.55 }
    })
  }

  waitlist = true

  emailValue = ''

  sendEmail(event: Event, isEmailValid: boolean | null) {
    event.preventDefault()
    if (isEmailValid) {
      this.userManager.sendEmail(this.emailValue)
      let snackBarRef = this._snackBar.open('Added to Waiting List!', '🎉🎉', {
        duration: 3000,
        panelClass: ['green-snackbar'],
      });
      snackBarRef.onAction().subscribe(() => {
        snackBarRef.dismiss()
      })
      this.emailValue = ''
    }
  }

  launchDate = new Date("Aug 10, 2024 12:00:00").getTime()

  constructor() {
    this.now = new Date().getTime()
    this.isLaunched = this.launchDate < this.now
    if (this.isLaunched) {
      this.remainingHours = 0
      this.remainingMinutes = 0
      this.remainingSeconds = 3
    }
  }

  isLaunched = false
  remainingHours = -1
  remainingMinutes = -1
  remainingSeconds = -1

  now: number
  HOUR_IN_MS = 1000 * 60 * 60
  MINUTE_IN_MS = 1000 * 60
  
  remainingTime = setInterval( () => {
    if (this.isLaunched) {
      if (this.remainingSeconds == 0) {
        this.launchConfetti()
        clearInterval(this.remainingTime)
        setTimeout(() => {
          this.emit()
          this.modalController.preLaunch = false
        }, 3000)
        return
      }
      this.remainingSeconds -= 1
    } else {
      this.now = new Date().getTime()
      const difference = this.launchDate - this.now
  
      this.remainingHours = Math.max(0, Math.floor(difference / (this.HOUR_IN_MS)))
      this.remainingMinutes = Math.max(0, Math.floor(difference % (this.HOUR_IN_MS) / (this.MINUTE_IN_MS)))
      this.remainingSeconds = Math.max(0, Math.floor(difference % (this.MINUTE_IN_MS) / 1000))
  

      if (difference < 0) {
        this.launchConfetti()
        clearInterval(this.remainingTime)
        setTimeout(() => {
          this.modalController.preLaunch = false
          this.launch.emit()
        }, 3000)
      }
    }

  }, 1000)

  ngOnDestroy() {
    if (this.remainingTime) {
      clearInterval(this.remainingTime)
    }
  }
}
