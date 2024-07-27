import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../../services/http-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { UserDataService } from '../../services/userData/user-data.service';
import { ModalControllerService, ModalType } from '../../services/modalController/modal-controller.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule, MatProgressSpinner],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  constructor(private _httpService: HttpService, private _snackBar: MatSnackBar, private router: Router, private _userDataService: UserDataService) {}
  modalController = inject(ModalControllerService)

  closeModal() {
    this.modalController.showModal(ModalType.login_OFF)
  }

  showSignUp = false
  tryingToLog = false

  toggleForm() {
    this.showSignUp = !this.showSignUp
  }

  emailValue = ''
  passwordValue = ''

  signUp(event: Event, isEmailValid: boolean, isPasswordValid: boolean) {
    event.preventDefault()
    if (isEmailValid && isPasswordValid) {
      this.tryingToLog = true
      this._httpService.signUp(this.emailValue, this.passwordValue).subscribe({
        next: () => {
          this.openSnackbar('Successful Sign Up', '🎉🎉');
          this.router.navigate(['/menu']);
          this.modalController.showModal(ModalType.login_OFF)
        },
        error: (error) => {
          console.error('Sign in error:', error);
          this.passwordValue = '';
          this.openSnackbar('Oops... something went wrong', '', true);
          this.tryingToLog = false;
        },
        complete: () => {
          this.tryingToLog = false;
        }
      })
    } else if (!isPasswordValid) {
      this.openSnackbar('Longer password required (8+ characters)', 'Okay')
      this.tryingToLog = false
    }
  }

  signIn(event: Event, isEmailValid: boolean, isPasswordValid: boolean) {
    event.preventDefault()
    if (isEmailValid && isPasswordValid) {
      this.tryingToLog = true
      this._httpService.signIn(this.emailValue, this.passwordValue).subscribe({
        next: () => {
          this._httpService.getUserData().subscribe({
            next: (res: any ) => {
              this._userDataService.userData = res.data
              this._userDataService.isPremiumUser = res.isPremium.is_premium ? true : false
              this.openSnackbar('Successful Sign In', '🎉🎉');
              this.router.navigate(['/menu']);
              this.tryingToLog = false;
              this.modalController.showModal(ModalType.login_OFF)
            },
            error: (error) => {
              console.error('Sign in error:', error);
              this.passwordValue = '';
              this.openSnackbar('Error getting user data', '', true);
              this.tryingToLog = false;
            },
          });
        },
        error: (error) => {
          console.error('Sign in error:', error);
          this.passwordValue = '';
          this.openSnackbar('Email or password incorrect', '', true);
          this.tryingToLog = false;
        },
      })
    }
  }

  sendError() {

  }

  openSnackbar(message: string, action: string, error?: boolean) {
    let snackBarRef = this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: error ? ['red-snackbar'] : ['snackbar']
    });
    snackBarRef.onAction().subscribe(() => {
      snackBarRef.dismiss()
    })
  }
}
