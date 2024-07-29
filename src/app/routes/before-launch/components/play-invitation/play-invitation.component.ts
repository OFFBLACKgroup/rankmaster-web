import { trigger, animate, transition, style, keyframes, state } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-play-invitation',
  standalone: true,
  imports: [],
  templateUrl: './play-invitation.component.html',
  styleUrl: './play-invitation.component.css',
  animations: [
    trigger('textEntryRight', [
      state('hidden', style({ opacity: 0 })),
      transition('* => visible', [
        style({ opacity: 0}),
        animate('0.3s 0.5s', keyframes([
          style({ transform: 'scale(0.75) rotate(-10deg)', offset: 0, opacity: 1 }),
          style({ transform: 'scale(0.875) rotate(0deg)', offset: 0.33 }),
          style({ transform: 'scale(1) rotate(5deg)', offset: 0.66 }),
          style({ transform: 'scale(1) rotate(0deg)', offset: 1 }),
        ]))
      ]),
      transition('visible => hidden', animate('0.3s ease-out'))
    ]),
    trigger('textEntryLeft', [
      state('hidden', style({ opacity: 0 })),
      transition('* => visible', [
        style({ opacity: 0}),
        animate('0.3s 1.5s', keyframes([
          style({ transform: 'scale(0.75) rotate(10deg)', offset: 0, opacity: 1 }),
          style({ transform: 'scale(0.875) rotate(0deg)', offset: 0.33 }),
          style({ transform: 'scale(1) rotate(-5deg)', offset: 0.66 }),
          style({ transform: 'scale(1) rotate(0deg)', offset: 1 }),
        ]))
      ]),
      transition('visible => hidden', animate('0.3s ease-out'))
    ]),
    trigger('lineEntry', [
      state('enter', style({ clipPath: 'inset(0 0 0 0)' })),
      state('hidden', style({ clipPath: 'inset(0 0 100% 0)' })),
      transition('hidden => enter', animate('0.5s 1s ease-out')),
    ]),
    trigger('textEntry', [
      state('enter', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('hidden => enter', animate('0.2s'))
    ]),
    trigger('arrowEntry', [
      state('hidden', style({ clipPath: 'inset(0 0 100% 0)' })),
      state('enter', style({ clipPath: 'inset(0 0 -100% 0)' })),
      transition('hidden => enter', animate('0.3s 0.4s'))
    ]),
    trigger('buttonPulse', [
      state('pulse', style({ transform: 'rotate(2deg) translateX(-1.5rem) scale(1)', opacity: 1 })),
      transition('* => pulse', animate('1s', keyframes([
        style({ transform: 'rotate(2deg) translateX(-1.5rem) scale(1)', offset: 0}),
        style({ transform: 'rotate(2deg) translateX(-1.5rem) scale(0.92)', offset: 0.5}),
        style({ transform: 'rotate(2deg) translateX(-1.5rem) scale(1.04)', offset: 0.75}),
        style({ transform: 'rotate(2deg) translateX(-1.5rem) scale(1)', offset: 1}),
      ])))
    ])
  ]
})
export class PlayInvitationComponent {
  currentMessageID = 0
  chatMessages = [
    ['Messi is the GOAT!', 'Ronaldo better'],
    ['LeBron is still playing!', '*MJ puts on jersey again*'],
    ['Just started reading HP...', 'LOTR is better. (Dobby dies)'],
    ['Like my new Android?', 'Stop sending green msgs 😡'],
    ["Xbox or PlayStation?", "Nintendo..."]
  ]
  messageState = 'visible'
  showLine = false
  showText = 'hidden'
  showArrow = 'hidden'
  firstTime = true
  buttonState = ''

  animationEnded(type: string, event: any) {
    switch (type) {
      case 'message':
        if (!this.showLine) {
          this.showLine = true
        } else {
          if (event.toState == 'visible') {
            this.cycleNext()
          }
        }
        break
      case 'line':
        if (event.fromState == 'hidden') {
          this.showText = 'enter'
        }
        break
      case 'arrow':
        if (event.fromState == 'hidden') {
          this.showArrow = 'enter'
        }
        break
      case 'nextMessage':
        if (event.fromState == 'hidden') {
          if (this.firstTime) {
            this.buttonState = 'pulse'
          }
          this.cycleNext()
        }
    }
  }

  cycleNext() {
    setTimeout(() => {
      this.messageState = 'hidden'
      setTimeout(() => {
        this.currentMessageID += this.currentMessageID == 4 ? -4 : 1
        this.messageState = 'visible'
      }, 500)
    }, 3000)
  }
}

// TODO PLAY! button functionality
