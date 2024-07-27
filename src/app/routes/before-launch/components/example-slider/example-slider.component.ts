import { Component } from '@angular/core';
import { trigger, style, transition, animate, state } from '@angular/animations';

const fadeInOutAnimation = trigger("fadeInOut", [
  transition(":enter", [
    style({ opacity: "0" }),
    animate("0.2s 0.1s ease-out", style({ opacity: "1" })),
  ]),
  transition(":leave", [
    style({ opacity: "1" }),
    animate("0.1s ease-out", style({ opacity: "0" })),
  ]),
])

const slideAnimation = trigger("slideAnimation", [
  state(
    'hidden',
    style({ opacity: 0 })
  ),
  state(
    'slideInFromleft',
    style({})
  ),
  state(
    'slideInFromRight',
    style({}),
  ),
  state(
    'slideOutLeft',
    style({ opacity: 0, transform: 'translateX(-100%)' })
  ),
  state(
    'slideOutRight',
    style({ opacity: 0, transform: 'translateX(100%)' })
  ),
  transition('* => slideInFromLeft', [
    style({ transform: 'translateX(-75%)', opacity: 0 }),
    animate('0.3s ease-in')
  ]),
  transition('* => slideInFromRight', [
    style({ transform: 'translateX(75%)', opacity: 0 }),
    animate('0.3s ease-in')
  ]),
  transition('* => slideOutLeft', [animate('0.3s ease-in')]),
  transition('* => slideOutRight', [animate('0.3s ease-in')]),
])

enum SelectionEnum {
  option1 = 0,
  option2 = 1,
  option3 = 2,
  min = 0,
  max = 2
}
// TODO create actual tier-list examples
@Component({
  selector: 'app-example-slider',
  standalone: true,
  imports: [],
  templateUrl: './example-slider.component.html',
  styleUrl: './example-slider.component.css',
  animations: [
    fadeInOutAnimation,
    slideAnimation
  ],
})
export class ExampleSliderComponent {
  selectedNo = SelectionEnum.option2
  slideStates = ['hidden', 'slideInFromLeft', 'hidden']

  selectItem(id: SelectionEnum) {
    if (this.selectedNo == id) { return }
    const movingRight = this.isMovingRight(id)
    this.move(id, movingRight)
    this.selectedNo = id
  }

  move(id: SelectionEnum, movingRight: boolean) {
    this.slideStates[this.selectedNo] = movingRight ? 'slideOutLeft' : 'slideOutRight'
    this.slideStates[id] = movingRight ? 'slideInFromRight' : 'slideInFromLeft'
  }

  isMovingRight(id: SelectionEnum) {
    return (id > this.selectedNo || id == 0 && this.selectedNo == 2) 
    && 
    (!(id == 2 && this.selectedNo == 0)) 
    ? true : false
  }

}
