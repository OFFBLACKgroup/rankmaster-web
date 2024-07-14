import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SocialsComponent } from '../../../../components/socials/socials.component';
import { FormsModule } from '@angular/forms';
import {MatProgressSpinner } from '@angular/material/progress-spinner';
import { trigger, transition, style, animate } from '@angular/animations';
import { HttpService } from '../../../../http-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginFormComponent } from '../login-form/login-form.component';

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
  constructor(private _httpService: HttpService, private _snackBar: MatSnackBar) {}
  @Output() showModal = new EventEmitter()

  emit() {
    this.showModal.emit()
  }

  waitlist = false

  emailValue = ''

  sendEmail(event: Event, isEmailValid: boolean | null) {
    event.preventDefault()
    if (isEmailValid) {
      this._httpService.sendEmail(this.emailValue)
      let snackBarRef = this._snackBar.open('Added to Waiting List!', '🎉🎉', {
        duration: 3000,
        panelClass: ['snackbar'],
      });
      snackBarRef.onAction().subscribe(() => {
        snackBarRef.dismiss()
      })
      this.emailValue = ''
    }
  }

  launchDate = new Date("Aug 07, 2024 00:00:00").getTime()

  lessThan24 = false
  remainingDays = -1
  remainingHours = -1
  remainingMinutes = -1
  remainingSeconds = -1

  remainingTime = setInterval( () => { 
    var now = new Date().getTime()
    var difference = this.launchDate - now

    if (!this.lessThan24) {
      if (difference < (1000 * 60 * 60 * 24)) {
        this.lessThan24 = true
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
