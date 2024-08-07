import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-username-select',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './username-select.component.html',
  styleUrl: './username-select.component.css',
  animations: [
    trigger('scale', [
      transition(':enter', [
        style({ transform: 'translateX(-50%) scale(0)' }),
        animate('0.3s ease-out', style({ transform: 'translateX(-50%) scale(1)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(-50%) scale(1)' }),
        animate('0.3s ease-in', style({ transform: 'translateX(-50%) scale(0)' }))
      ])
    ]),
    trigger('button', [
      transition(':enter', [
        style({ transform: 'translateX(0%)', opacity: 0 }),
        animate('0.3s ease-out', style({ transform: 'translateX(75%)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0.3s ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class UsernameSelectComponent {
  userIconStrings = new Array(12).fill(0).map((_, i) => `user_icon${i + 1}.png`)
  showIconSelector = false
  selectedIcon = -1
  userName = ''
  isValid = false

  selectIcon(index: number) {
    this.selectedIcon = index
  }

  toggleIconSelector() {
    this.showIconSelector = !this.showIconSelector;
  }

  hideIconSelector() {
    if (this.showIconSelector) {
      this.showIconSelector = false
    }
  }

  checkValidity() {
    this.isValid = this.userName.length >= 3 && this.userName.length <= 16
  }
}
