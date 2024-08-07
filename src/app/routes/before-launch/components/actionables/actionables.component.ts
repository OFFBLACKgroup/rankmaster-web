import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { SocialsComponent } from '../../../../components/socials/socials.component';
import { FormsModule } from '@angular/forms';
import {MatProgressSpinner } from '@angular/material/progress-spinner';
import { trigger, transition, style, animate } from '@angular/animations';
import { TierlistManagerService } from '../../../../services/tierlistManager/tierlist-manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginFormComponent } from '../../../../components/login-form/login-form.component';
import { UserManagerService } from '../../../../services/userManager/user-manager.service';

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
  @Output() showModal = new EventEmitter()

  emit() {
    this.showModal.emit()
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

  lessThan72 = true
  remainingDays = -1
  remainingHours = -1
  remainingMinutes = -1
  remainingSeconds = -1

  remainingTime = setInterval( () => { 
    var now = new Date().getTime()
    var difference = this.launchDate - now

    if (!this.lessThan72) {
      if (difference < (1000 * 60 * 60 * 72)) {
        this.lessThan72 = true
        this.remainingHours = Math.floor(difference / (1000 * 60 * 60))
        this.remainingMinutes = Math.floor(difference % (1000 * 60 * 60) / (1000 * 60))
        this.remainingSeconds = Math.floor(difference % (1000 * 60) / 1000)
      } else {
        this.remainingDays = Math.floor(difference / (1000 * 60 * 60 * 24))
        this.remainingHours = Math.floor(difference % (1000 * 60 * 60 * 24) / (1000 * 60 * 60))
        this.remainingMinutes = Math.floor(difference % (1000 * 60 * 60) / (1000 * 60))
      }
    } else {
      this.remainingHours = Math.floor(difference / (1000 * 60 * 60))
      this.remainingMinutes = Math.floor(difference % (1000 * 60 * 60) / (1000 * 60))
      this.remainingSeconds = Math.floor(difference % (1000 * 60) / 1000)
    }
  }, 1000)
}
