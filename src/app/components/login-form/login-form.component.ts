import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TierlistManagerService } from '../../services/tierlistManager/tierlist-manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { UserManagerService } from '../../services/userManager/user-manager.service';
import { ModalControllerService, ModalType } from '../../services/modalController/modal-controller.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule, MatProgressSpinner],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  private tierlistManager = inject(TierlistManagerService);
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private _userManager = inject(UserManagerService);
  modalController = inject(ModalControllerService)

  closeModal() {
    this.modalController.hideModal()
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
      this._userManager.signUp(this.emailValue, this.passwordValue).subscribe({
        next: () => {
          this.openSnackbar('Successful Sign Up', '🎉🎉');
          this.router.navigate(['/menu'])
          this.modalController.hideModal()
          this.modalController.showModal(ModalType.username_select)
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
      this._userManager.signIn(this.emailValue, this.passwordValue).subscribe({
        next: () => {
          this._userManager.getUserData().subscribe({
            next: (res: any ) => {
              console.log(res)
              this._userManager.userData = res.completedTierlists
              this._userManager.isPremiumUser = res.userData.is_premium
              if (res.userData.username) {
                if (res.userData.icon_id) {
                  this._userManager.userIconID = res.userData.icon_id
                } else {
                  this._userManager.userIconID = -1
                }
              } else {
                this.modalController.showModal(ModalType.username_select)
              }
              this.openSnackbar('Successful Sign In', '🎉🎉');
              //TODO set user icon on login
              this.router.navigate(['/menu']);
              this.tryingToLog = false;
              this.modalController.hideModal()
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

  openSnackbar(message: string, action: string, error?: boolean) {
    let snackBarRef = this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: error ? ['red-snackbar'] : ['green-snackbar']
    });
    snackBarRef.onAction().subscribe(() => {
      snackBarRef.dismiss()
    })
  }
}
