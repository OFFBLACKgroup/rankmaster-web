import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, ViewChild, inject } from '@angular/core';
import { DndModule, DndDropEvent } from 'ngx-drag-drop';
import { animate, keyframes, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { MarkerColor, TierListItem } from '../../routes/main-menu/topics/topic-tierlists/play-tierlist/play-tierlist.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';
import { preloadImages } from '../../routes/main-menu/topics/topics.component';
import { HttpService } from '../../services/http-service.service';
import { ActivatedRoute } from '@angular/router';

export interface Prediction {
  tierlist_item_id: number,
  predicted_tier: number,
  points_for_item?: number
}

//TODO display how far off a guess was from correct tier
//TODO create logic for when daily tierlist is being played

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
    trigger('rotateScaleIn', [
      transition(':enter', [
        style({ transform: 'rotateX(80deg)', opacity: 0 }),
        animate('0.5s 1s cubic-bezier(0.250, 0.460, 0.450, 0.940)', style({ transform: 'rotateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class TierListComponent implements OnChanges {
  changeDetector = inject(ChangeDetectorRef)
  _httpService = inject(HttpService)
  _activeRoute = inject(ActivatedRoute)

  @Input() dailyTierlist: boolean = false
  @Input() tierlistItems: TierListItem[] = []

  ngOnInit() {
    if(this.dailyTierlist) {
      this._httpService.fetchDailyTierlist().subscribe((res: any) => {
        this._httpService.fetchTierlist(res[0].id).subscribe((res: any) => {
          this.tierlistItems = res as TierListItem[]
          this.calcRows()
        })
      })
    }
  }

  numOfRows?: number

  calcRows() {
    this.numOfRows = this.tierlistItems.length <= 5 ? 3 : this.tierlistItems.length <= 8 ? 5 : 7
      preloadImages(this.tierlistItems.map(item => item.file_path), this.loadData)
  }

  ngOnChanges() {
    if (!this.numOfRows && this.tierlistItems.length != 0) {
      this.calcRows()
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

  @ViewChild ('coinscontainer', { static: false }) coinsContainer?: ElementRef

  coinsWidth = '268px'
  coins: number[] = [];
  showCoins = false
  numOfPoints: number = 0

  changeCoinsWidth(coins: number) {
    this.coinsWidth = 67 + (coins - 1) * 33.5 + 'px'
  }

  // calculateMarkerColor(pointsReceived: number) {
  //   if (this.numOfRows) {
  //     switch (this.numOfRows) {
  //       case 3:
  //         return pointsReceived == 1 ? MarkerColor.yellow : MarkerColor.perfect
  //       case 5:
  //         return pointsReceived == 1 ? MarkerColor.yellow : pointsReceived == 2 ? MarkerColor.green : MarkerColor.perfect
  //       case 7:
  //         return pointsReceived == 1 ? MarkerColor.red : pointsReceived == 2 ? MarkerColor.yellow : pointsReceived == 3 ? MarkerColor.green : MarkerColor.perfect
  //       default:
  //         return MarkerColor.red
  //     }
  //   } else {
  //     return MarkerColor.red
  //   }
  // }

  finish() {
    this.finished = true
    this.changeDetector.detectChanges()
    const topicID = this._activeRoute.snapshot.paramMap.get('topicID')
    const predictionData = this.getPrediction()
    if (topicID) {
      this._httpService.calculatePoints(Number(topicID), this.tierlistItems[0].tierlist_ID, predictionData).subscribe((res: any) => {
        if (this.numOfRows) {
          this.numOfPoints = res.points
          const maxPoint = (this.numOfRows == 3 ? 2 : this.numOfRows == 5 ? 3 : 4) * this.tierlistItems.length
          const numOfCoins = Math.round( (res / maxPoint) * 7 )
          this.coins = Array.from({ length: numOfCoins + 1 }, (_, i) => i);
          this.showCoins = true
          // res.predictions.forEach((prediction: Prediction) => {
            // for (let i = 0; i < this.tierData.length; i++) {
            //   for (let j = 0; j < this.tierData[i].length; j++) {
            //     if (this.tierData[i][j].id == prediction.tierlist_item_id) {
            //       if (prediction.points_for_item) {
            //         this.tierData[i][j].result_marker_color = this.calculateMarkerColor(prediction.points_for_item)
            //       }
            //     }
            //   }
            // }
          // })
          if (this.coinsContainer) {
            setTimeout(() => {
              if (this.coinsContainer) {
                this.coinsContainer.nativeElement.scrollIntoView({ behavior: "smooth", block: "end" });
              }
            }, 50)
          }
        }
      })
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

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
