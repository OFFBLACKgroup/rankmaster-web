import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, ViewChild, inject } from '@angular/core';
import { DndModule, DndDropEvent } from 'ngx-drag-drop';
import { animate, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { TierListItem } from '../../routes/main-menu/topics/topic-tierlists/play-tierlist/play-tierlist.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';
import { preloadImages } from '../../routes/main-menu/topics/topics.component';
import { HttpService } from '../../http-service.service';
import { ActivatedRoute } from '@angular/router';

export interface Prediction {
  tierlist_item_id: number,
  predicted_tier: number
}

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
    ]),
    trigger('slideInFromLeft', [
      transition(':enter', [
        style({ transform: 'translateX(-15rem)' }),
        animate('0.25s ease-out', style({ transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideInFromRight', [
      transition(':enter', [
        style({ transform: 'translateX(15rem)' }),
        animate('0.25s ease-out', style({ transform: 'translateX(0)' }))
      ])
    ]),
    trigger('scaleOut', [
      transition(':leave', [
        style({ }),
        animate('0.3s ease-in', style({ height: '0', transform: 'scale(0)' }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ transform: 'scale(0.3)', opacity: 0.4 }),
        animate('0.3s ease-in', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]),
    trigger('coinsAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(200px)' }),
          stagger('100ms', 
            animate('701ms 200ms ease-out', 
              style({ opacity: 1, transform: '' })
            )
          )
        ], { optional: true })
      ])
    ]),
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(50px)' }),
        animate('0.5s 0.8s ease-out', style({ transform: '*' }))
      ])
    ])
  ]
})
export class TierListComponent implements OnChanges {
  changeDetector = inject(ChangeDetectorRef)
  _httpService = inject(HttpService)
  _activeRoute = inject(ActivatedRoute)

  @ViewChild ('coinscontainer', { static: false }) coinsContainer?: ElementRef

  coins = [1, 2, 3, 4, 5, 6, 7];

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

  getPrediction() {
    const prediction: Prediction[] = []

    this.tierData.forEach((row, i) => {
      row.forEach((item, j) => {
        if (item) {
          prediction.push({
            tierlist_item_id: item.id,
            predicted_tier: i
          })
        }
      });
    });
    
    return prediction
  }

  finish() {
    this.finished = true
    this.changeDetector.detectChanges()
    const topicID = this._activeRoute.snapshot.paramMap.get(':topicID')
    const predictionData = this.getPrediction()
    if (topicID) {
      this._httpService.calculatePoints(Number(topicID), this.tierlistItems[0].tierlist_ID, predictionData).subscribe((res) => console.log(res))
    }
    if (this.coinsContainer) {
      setTimeout(() => {
        if (this.coinsContainer) {
          this.coinsContainer.nativeElement.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }, 50)
    }
  }

  maxItems?: number

  calculateMaxItems(rowWidth: number, rowId: number) {
    if (!this.maxItems) {
      this.maxItems = Math.floor(rowWidth / 104)
    }
  }

  getTooltip(rowIndex: number, index: number) {
    const tooltip = this.tierlistItems.find(el => el.file_path == this.tierData[rowIndex][index].file_path)
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

  tierData: TierListItem[][] = Array.from({ length: 7 }, () => [])

  draggedFromRow?: number;
  draggedIndex?: number;

  onDragStart(rowIndex: number, index: number) {
    this.draggedFromRow = rowIndex
    this.draggedIndex = index;
    this.currentPlaceholder = this.tierlistItems.findIndex(item => item.file_path == this.tierData[rowIndex][index].file_path)
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
    if (this.draggedFromRow != undefined) {
      this.draggedFromRow = undefined
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
