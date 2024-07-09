import { Component, Input, OnInit } from '@angular/core';
import { DndModule } from 'ngx-drag-drop';
import { DndDropEvent } from 'ngx-drag-drop';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TierListItem } from '../../routes/topics/topic-tierlists/play-tierlist/play-tierlist.component';

@Component({
  selector: 'app-tier-list',
  standalone: true,
  imports: [DndModule],
  templateUrl: './tier-list.component.html',
  styleUrl: './tier-list.component.css',
  animations: [
    trigger('shrink', [
      state('initial', style({ transform: 'scaleX(100%)' })),
      state('shrink', style({ transform: 'scaleX(0%)' })),
      transition('initial => shrink', [animate('0.4s 0.1s ease-in')])
    ])
  ]
})
export class TierListComponent {

  @Input() tierlistItems: TierListItem[] = []

  finished = false
  
  calculateRows() {
    if (this.tierlistItems.length != 0) {
      return [].constructor(this.tierlistItems.length <= 5 ? 3 : this.tierlistItems.length <= 8 ? 5 : 7)
    }
  } 

  draggable = {
    effectAllowed: "all",
    disable: false,
    handle: false
  };

  currentItem = 0

  tiers = ['S', 'A', 'B', 'C', 'D', 'E', 'F']
  backgroundColors = ['#FF3131', '#FF7518', '#FFBF00', '#32CD32', '#00FFFF', '#1F51FF', '#DA70D6']

  tierData: string[][] = Array.from({ length: 7 }, () => [])

  onDrop(e: DndDropEvent, index: number) {
    if (e.index != undefined) {
      this.tierData[index].splice(e.index, 0, e.data)
      this.nextUp()
    }
  }

  nextUp() {
    if (this.currentItem == this.tierlistItems.length - 1) {
      this.finished = true
    } else {
      this.currentItem += 1
    }
  }
}
