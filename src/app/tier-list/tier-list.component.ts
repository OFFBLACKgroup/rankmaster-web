import { Component } from '@angular/core';
import {CdkDrag, CdkDropList, CdkDragDrop, CdkDragEnd, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tier-list',
  standalone: true,
  imports: [CdkDrag, CdkDropList],
  templateUrl: './tier-list.component.html',
  styleUrl: './tier-list.component.css'
})
export class TierListComponent {
  tiers = ['S', 'A', 'B', 'C', 'D', 'E', 'F']
  backgroundColors = ['#FF3131', '#FF7518', '#FFBF00', '#32CD32', '#00FFFF', '#1F51FF', '#DA70D6']

  drop(e: CdkDragDrop<string[]>) {
    this.tierData.splice(e.currentIndex, 0, e.item.data)
  }

  nextUp = "../../assets/tokyo revengers.png"
  tierData: string[] = []

  sortPredicate(index: number, item: CdkDrag<number>) {
    return index == 0;
  }

  test() {}
}
