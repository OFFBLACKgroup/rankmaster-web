import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DndModule, DndDropEvent } from 'ngx-drag-drop';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TierListItem } from '../../routes/main-menu/topics/topic-tierlists/play-tierlist/play-tierlist.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';
import { preloadImages } from '../../routes/main-menu/topics/topics.component';

@Component({
  selector: 'app-tier-list',
  standalone: true,
  imports: [DndModule, MatProgressSpinner, MatTooltipModule],
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
export class TierListComponent implements OnChanges {

  @Input() tierlistItems: TierListItem[] = []

  numOfRows?: number

  ngOnChanges() {
    if (!this.numOfRows && this.tierlistItems.length != 0) {
      this.numOfRows = this.tierlistItems.length <= 5 ? 3 : this.tierlistItems.length <= 8 ? 5 : 7
      preloadImages(this.tierlistItems.map(item => item.file_path), this.loadData)
    }
  }

  array(n: number) {
    return Array(n)
  }

  loadData = {
    areImagesLoaded: false,
    numOfLoaded: 0
  }

  placedAll = false
  finished = false

  finish() {
    this.finished = true
  }

  maxItems?: number

  calculateMaxItems(rowWidth: number, rowId: number) {
    if (!this.maxItems) {
      this.maxItems = Math.floor(rowWidth / 104)
    }
  }

  getTooltip(rowIndex: number, index: number) {
    const tooltip = this.tierlistItems.find(el => el.file_path == this.tierData[rowIndex][index])
    if (tooltip) {
      return tooltip.name
    } else {
      return 'Item'
    }
  }

  currentItem = 0
  currentPlaceholder = 0

  tiers = ['S', 'A', 'B', 'C', 'D', 'E', 'F']
  backgroundColors = ['#FF3131', '#FF7518', '#FFBF00', '#32CD32', '#00FFFF', '#1F51FF', '#DA70D6']

  tierData: string[][] = Array.from({ length: 7 }, () => [])

  draggedFromRow?: number;
  draggedIndex?: number;

  onDragStart(rowIndex: number, index: number) {
    this.draggedFromRow = rowIndex
    this.draggedIndex = index;
    this.currentPlaceholder = this.tierlistItems.findIndex(item => item.file_path == this.tierData[rowIndex][index])
  }

  showFiller: string[] = ['block', 'block', 'block', 'block', 'block', 'block', 'block']

  onDrop(e: DndDropEvent, rowIndex: number) {
    if (e.index != undefined) {
      if (e.type == 'import') {
        this.tierData[rowIndex].splice(e.index, 0, e.data)
        this.nextUp()
      } else {
        if (this.currentItem != this.currentPlaceholder) {
          this.currentPlaceholder = this.currentItem
        }
        if (this.draggedFromRow != undefined && this.draggedIndex != undefined) {
          this.tierData[this.draggedFromRow].splice(this.draggedIndex, 1)
          this.tierData[rowIndex].splice(e.index, 0, e.data)
        }
      }
      this.calcShowFiller()
    }
  }

  nextUp() {
    if (this.currentItem == this.tierlistItems.length - 1) {
      this.placedAll = true
    } else {
      this.currentItem += 1
      this.currentPlaceholder += 1
    }
  }

  calcShowFiller() {
    for (let i = 0; i < this.showFiller.length; i++) {
      if (this.tierData[i].length % 4 == 0 && this.tierData[i].length != 0) {
        this.showFiller[i] = 'none'
      } else {
        this.showFiller[i] = 'block'
      }
    }
  }
}
