import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BeforeLaunchComponent } from './routes/before-launch/before-launch.component';
import { HeaderComponent } from './components/header/header.component';
import { animate, animateChild, keyframes, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { LoginFormComponent } from './routes/before-launch/components/login-form/login-form.component';
import { HowToComponent } from './routes/before-launch/components/how-to/how-to.component';
import { PricingModalComponent } from './components/pricing-modal/pricing-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BeforeLaunchComponent, HeaderComponent, LoginFormComponent, HowToComponent, PricingModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('mountainDecoration', [
      transition('* <=> *', [
        query("@rowAnimation", stagger(50, animateChild())),
        query('@goatAnimation', animateChild())
      ])
    ]),
    trigger('rowAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('0.3s ease-out', style({ transform: 'translateX(0%)' }))
      ])
    ]),
    trigger('goatAnimation', [
      transition(':enter', [
          style({ opacity: 0, transform: 'scale(0.6) translate(3rem, 2rem)' }),
          animate('0.3s 0.5s ease-out', style({ opacity: 0.2, transform: 'scale(1) translateX(0)' })),
      ])
    ]),
    trigger('hotAirBalloon', [
      state('top', style({ transform: 'translate(0, -65vh)' })),
      state('left', style({ transform: 'translate(0, -65vh) rotate(12deg)' })),
      state('right', style({ transform: 'translate(0, -65vh) rotate(-12deg)' })),
      transition('void => top', animate('4s ease-out')),
      transition('top => right', animate('1.2s ease-in-out')),
      transition('right => left', animate('2.4s ease-in-out', keyframes([
        style({ transform: 'translate(0, -65vh)', offset: 0.5 }),
        style({ transform: 'translate(0, -65vh) rotate(12deg)' , offset: 1 })
      ]))),
      transition('left => right', animate('2.4s ease-in-out', keyframes([
        style({ transform: 'translate(0, -65vh)', offset: 0.5 }),
        style({ transform: 'translate(0, -65vh) rotate(-12deg)' , offset: 1 })
      ]))),
    ])
  ]
})
export class AppComponent {
  title = 'rankmaster';
  intervalRef?: any
  firstEnd = true

  balloonState = 'top'

  startFloating() {
    if (this.firstEnd) {
      this.balloonState = 'right'
      this.intervalRef = setInterval(() => {
        this.floatingSetter()
      }, 2400)
      this.firstEnd = false
    }
  }

  floatingSetter() {
    if (this.balloonState == 'top') {
      this.balloonState = 'right'
    } else if (this.balloonState == 'left') {
      this.balloonState = 'right'
    } else {
      this.balloonState = 'left'
    }
  }

  rows = [0,1,2,3,4,5,6]

  ngOnDestroy() {
    if (this.intervalRef) {
      clearInterval(this.intervalRef)
    }
  }
}
