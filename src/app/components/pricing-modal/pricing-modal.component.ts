import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { HttpService } from '../../services/http-service.service';

@Component({
  selector: 'app-pricing-modal',
  standalone: true,
  imports: [],
  templateUrl: './pricing-modal.component.html',
  styleUrl: './pricing-modal.component.css',
  animations: [
    trigger('rotateIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'rotate(-20deg) translateY(25%) translateX(10%) scale(0.8)' }),
        animate('0.25s 1s ease-in', style({ opacity: 1, transform: 'rotate(0) translateY(0) translateX(10%) scale(1)' }))
      ])
    ])
  ]
})
export class PricingModalComponent {
  @Output() hideModal = new EventEmitter()
  private _httpService = inject(HttpService)

  userId?: string

  ngOnInit() {
    this._httpService.getUserID().subscribe( (res) => {
      this.userId = res as string
    })
  }

  linkDirection = 'https://buy.stripe.com/7sI4jq4feb1nfO8000?client_reference_id='

  emit() {
    this.hideModal.emit()
  }
}
