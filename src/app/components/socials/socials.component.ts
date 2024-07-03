import { Component } from '@angular/core';
import { trigger, state, style, transition, keyframes, animate } from '@angular/animations';

@Component({
  selector: 'app-socials',
  standalone: true,
  imports: [],
  templateUrl: './socials.component.html',
  styleUrl: './socials.component.css',
  animations: [
    trigger('buzz', [
      state(
        'initial',
        style({

        }),
      ),
      state(
        'buzz',
        style({

        })
      ),
      transition('* => *', [animate(
        '0.5s',
        keyframes([
          style({transform: 'scale(1.1) rotate(5deg)', offset: 0.25}),
          style({transform: 'scale(1.1) rotate(-5deg)', offset: 0.75}),
          style({transform: 'scale(1.0) rotate(0deg)', offset: 1}),
        ])
      )])
    ]),
  ]
})
export class SocialsComponent {
  isBuzzing: ('initial' | 'buzz')[] = ['initial', 'initial', 'initial']

  triggerBuzz(id: number) {
    if (this.isBuzzing[id] == 'initial') {
      this.isBuzzing[id] = 'buzz'
    } else {
      this.isBuzzing[id] = 'initial'
    }
  }
}
