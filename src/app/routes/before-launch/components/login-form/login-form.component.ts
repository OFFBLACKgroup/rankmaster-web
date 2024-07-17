import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../../../../http-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { UserDataService } from '../../../../user-data.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule, MatProgressSpinner],
  template: `
  <form (ngSubmit)="showSignUp ? signUp($event, !email.invalid, !password.invalid) : signIn($event, !email.invalid, !password.invalid)">
    <button type="button" (click)="closeModal()" aria-label="close" class="close">
      <img src='assets/close.svg'>
    </button>
    <h3>{{ showSignUp ? 'Sign Up' : 'Sign In' }}</h3>
    <input id="email" #email="ngModel" required type="email" name="email" [(ngModel)]="emailValue" email placeholder="Enter your email address">
    <input id="password" #password="ngModel" required minlength="8" type="password" name="password" [(ngModel)]="passwordValue" password placeholder="Enter your password">
    <button type="submit" (click)="showSignUp ? signUp($event, !email.invalid, !password.invalid) : signIn($event, !email.invalid, !password.invalid)" class="ng-valid submit">
      Continue
      @if (tryingToLog) {
        <mat-progress-spinner mode="indeterminate" diameter="24"></mat-progress-spinner>
      }
    </button>
    <p>Or</p>
    <h4>{{ showSignUp ? 'Already signed up?' : "Haven't signed up yet?" }} <span (click)="toggleForm()">{{ showSignUp ? 'Sign In' : 'Sign Up' }}</span></h4>
  </form>
  `,
  styles: [`
    form {
      width: 20rem;
      margin: 0 auto;
      background-color: white;
      border-radius: 1rem;
      padding: 1rem;
      font-family: 'Poppins';
      text-align: center;
      position: relative;
    }

    form h3 {
      font-size: clamp(1.25rem, 1.083rem + 0.348vw, 1.5rem);
      font-weight: 500;
      margin: 0
    }

    input {
      display: block;
      width: 100%;
      margin-top: 1rem;
      height: 2.5rem;
      border-radius: 0.5rem;
      border: 1px solid rgba(102, 102, 102, 0.35);
      padding-left: 1rem;
      font: 1rem 'Poppins'
    }

    form .submit {
      margin-top: 0.75rem;
      width: 100%;
      height: 2.5rem;
      border-radius: 1.25rem;
      color: white;
      background-color: rgba(17, 17, 17, 0.25);
      border: transparent;
      font: 1rem 'Poppins';
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem
    }

    form p {
      text-transform: uppercase;
      color: gray;
      position: relative;
      width: max-content;
      margin: 1rem auto 0 auto;
    }
    form p::before {
      content: '';
      position: absolute;
      right: calc(100% + 0.5rem);
      top: calc(50% - 1px);
      width: 2rem;
      height: 2px;
      background-color: gray;
    }
    form p::after {
      content: '';
      position: absolute;
      left: calc(100% + 0.5rem);
      top: calc(50% - 1px);
      width: 2rem;
      height: 2px;
      background-color: gray;
    }

    form button.close {
      position: absolute;
      top: 5%;
      right: 5%;
      border: transparent;
      width: 2rem;
      height: 2rem;
      background-color: transparent;
      cursor: pointer;
    }

    button.close img {
      height: 100%;
      width: 100%;
      object-fit: contain;
    }

    form h4 {
      font-size: 1rem; 
    }

    form h4 span {
      color: #632DE9;
      font-weight: 700;
      cursor: pointer;
    }

    .ng-valid button {
      background-color: rgb(17, 17, 17);
      cursor: pointer;
    }

    @media only screen and (max-width: 768px) {
      input {
        font-size: 0.875rem;
      }

      form h3 {
        font-size: 18px;
      }
    }

    @media only screen and (max-height: 768px) {
      form input {
        margin-top: 1rem;
      }  
    } 
  `]
})
export class LoginFormComponent {
  constructor(private _httpService: HttpService, private _snackBar: MatSnackBar, private router: Router, private _userDataService: UserDataService) {}
  @Output() hideModal = new EventEmitter()

  closeModal() {
    this.hideModal.emit()
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
