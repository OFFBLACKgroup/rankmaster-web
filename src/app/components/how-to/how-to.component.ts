import { animate, animateChild, query, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, ElementRef, HostBinding, ViewChild, inject } from '@angular/core';
import { ModalControllerService, ModalType } from '../../services/modalController/modal-controller.service';

@Component({
  selector: 'app-how-to',
  standalone: true,
  imports: [],
  templateUrl: './how-to.component.html',
  styleUrl: './how-to.component.css',
  animations: [
    trigger('slideFromRight', [
      state('initial', style({ left: '100%' })),
      state('followUp', style({ left: '-{{firstLineMainPart}}px' }), {params: {firstLineMainPart: 0}}),
      state('final', style({ left: '-{{firstListWidth}}px' }), {params: {firstListWidth: 0}}),
      transition('initial => followUp', animate('{{firstPart}}s'), {params: {firstPart: 0}}),
      transition('followUp => final', animate('{{secondPart}}s'), {params: {secondPart: 0}})
    ]),
    trigger('slideFromLeft', [
      state('initial', style({ right: '100%' })),
      state('followUp', style({right: '-{{secondLineMainPart}}px', }), {params: {secondLineMainPart: 0}}),
      state('final', style({ right: '-{{secondListWidth}}px' }), {params: {secondListWidth: 0}}),
      transition('initial => followUp', animate('{{thirdPart}}s'), {params: {thirdPart: 0}}),
      transition('followUp => final', animate('{{fourthPart}}s'), {params: {fourthPart: 0}})
    ]),
  ]
})
export class HowToComponent {

  cdr = inject(ChangeDetectorRef)
  modalController = inject(ModalControllerService)

  closeModal() {
    this.modalController.showModal(ModalType.howTo_OFF)
  }

  @ViewChild('firstList') firstListRef?: ElementRef
  @ViewChild('secondList') secondListRef?: ElementRef

  firstListWidth?: number
  secondListWidth?: number
  firstPart?: number
  secondPart?: number
  thirdPart?: number
  fourthPart?: number
  firstLineMainPart?: number
  secondLineMainPart?: number

  steps = ['Read the Topic of the tier list:', 'You are shown a list of items', 'Place them in tiers:', 'Compete against others!']

  topics = [
    ['Best Football Teams', 'Rappers Eminem is Afraid to Diss', 'Best Drift Cars'],
    ['Fruits', 'Waifu Tier List', 'Strongest Anime Character', 'OG Video Games']
  ]

  tiers = [
    { name: 'S', color: '#FF3131' },
    { name: 'A', color: '#FF7518' },
    { name: 'B', color: '#FFBF00' },
    { name: 'C', color: '#32CD32' }
  ]

  firstSliderState = 'initial'
  secondSliderState = 'initial'
  thirdSliderState = 'initial'
  fourthSliderState = 'initial'

  ngAfterViewInit() {
    this.firstListWidth = this.firstListRef?.nativeElement.offsetWidth
    this.secondListWidth = this.secondListRef?.nativeElement.offsetWidth
    if (this.firstListWidth && this.secondListWidth) {
      this.firstPart = (this.firstListWidth + 16) / (this.firstListWidth + 360) * 15
      this.secondPart = 15 - this.firstPart
      this.thirdPart = (this.secondListWidth + 16) / (this.secondListWidth + 360) * 15
      this.fourthPart = 15 - this.thirdPart
      this.firstLineMainPart = this.firstListWidth - 344
      this.secondLineMainPart = this.secondListWidth - 344
    }

    this.firstSliderState = 'followUp'
    this.thirdSliderState = 'followUp'
    this.cdr.detectChanges()
  }

  animationEnded(event: any, id: number) {
    if (event.toState == 'followUp') {
      switch (id) {
        case 0:
          this.firstSliderState = 'final'
          this.secondSliderState = 'followUp'
          break
        case 1:
          this.secondSliderState = 'final'
          this.firstSliderState = 'followUp'
          break
        case 2:
          this.thirdSliderState = 'final'
          this.fourthSliderState = 'followUp'
          break
        case 3:
          this.fourthSliderState = 'final'
          this.thirdSliderState = 'followUp'
          break
      }
    } else if (event.toState == 'final') {
      switch (id) {
        case 0:
          this.firstSliderState = 'initial'
          break
        case 1:
          this.secondSliderState = 'initial'
          break
        case 2:
          this.thirdSliderState = 'initial'
          break
        case 3:
          this.fourthSliderState = 'initial'
          break
      }
    }
  }
}
