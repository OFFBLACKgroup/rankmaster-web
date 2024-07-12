import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../../../../../http-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule],
  template: `
  <form>
    <h3>{{ showSignUp ? 'Sign Up' : 'Sign In' }}</h3>
    <input id="email" #email="ngModel" required type="email" name="email" [(ngModel)]="emailValue" email placeholder="Enter your email address">
    <input id="password" #password="ngModel" required minlength="8" type="password" name="password" [(ngModel)]="passwordValue" password placeholder="Enter your password">
    <button (click)="showSignUp ? signUp($event, !email.invalid, !password.invalid) : signIn($event, !email.invalid, !password.invalid)" class="ng-valid">Continue</button>
    <p>Or</p>
    <h4>{{ showSignUp ? 'Already signed up?' : "Haven't signed up yet?" }} <span (click)="toggleForm()">{{ showSignUp ? 'Sign In' : 'Sign Up' }}</span></h4>
  </form>
  `,
  styles: [`
    form {
      width: 90%;
      margin: 0 auto;
      background-color: white;
      border-radius: 1rem;
      padding: 1rem;
      font-family: 'Poppins';
      text-align: center;
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

    form button {
      margin-top: 0.75rem;
      width: 100%;
      height: 2.5rem;
      border-radius: 1.25rem;
      color: white;
      background-color: rgba(17, 17, 17, 0.25);
      border: transparent;
      font: 1rem 'Poppins'
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
  constructor(private _httpService: HttpService, private _snackBar: MatSnackBar) {}
  showSignUp = true

  toggleForm() {
    this.showSignUp = !this.showSignUp
  }

  emailValue = ''
  passwordValue = ''

  signUp(event: Event, isEmailValid: boolean, isPasswordValid: boolean) {
    event.preventDefault()
    if (isEmailValid && isPasswordValid) {
      this._httpService.signUp(this.emailValue, this.passwordValue).subscribe((config) => {
        console.log(config)
      })
      let snackBarRef = this._snackBar.open('Successful Sign Up!', '🎉🎉', {
        duration: 3000,
        panelClass: ['snackbar'],
      });
      snackBarRef.onAction().subscribe(() => {
        snackBarRef.dismiss()
      })
      this.emailValue = ''
      this.passwordValue = ''
    } else if (!isPasswordValid) {
      let snackBarRef = this._snackBar.open('Longer password required (8+ characters)', 'Okay', {
        duration: 3000,
        panelClass: ['snackbar'],
      });
      snackBarRef.onAction().subscribe(() => {
        snackBarRef.dismiss()
      })
    }
  }

  signIn(event: Event, isEmailValid: boolean, isPasswordValid: boolean) {
    event.preventDefault()
    if (isEmailValid && isPasswordValid) {
      this._httpService.signIn(this.emailValue, this.passwordValue).subscribe((config) => {
        console.log(config)
      })
      let snackBarRef = this._snackBar.open('Successful Sign In!', '🎉🎉', {
        duration: 3000,
        panelClass: ['snackbar'],
      });
      snackBarRef.onAction().subscribe(() => {
        snackBarRef.dismiss()
      })
      this.emailValue = ''
      this.passwordValue = ''
    }
  }
}
