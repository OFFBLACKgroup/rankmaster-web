import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild, inject } from '@angular/core';
import { DndModule, DndDropEvent } from 'ngx-drag-drop';
import { animate, animateChild, query, sequence, stagger, state, style, transition, trigger } from '@angular/animations';
import { TierListItem } from '../../routes/main-menu/topics/topic-tierlists/play-tierlist/play-tierlist.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { preloadImages } from '../../routes/main-menu/topics/topics.component';
import { TierlistManagerService } from '../../services/tierlistManager/tierlist-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TierList } from '../../routes/main-menu/topics/topic-tierlists/topic-tierlists.component';
import { UserManagerService } from '../../services/userManager/user-manager.service';
import { ModalControllerService, ModalType } from '../../services/modalController/modal-controller.service';

export enum MarkerColor {
  red = 'red',
  yellow = 'yellow',
  green = '#32CD32',
  perfect = '',
}

export interface Prediction {
  tierlist_item_id: number;
  predicted_tier: number;
  points_for_item?: number;
  correct_tier?: number;
}

//OPTIMIZABLE create code sections for tier-list (largest logic file)
//BUG there is a bug with coins having to jump from end of animation to their final position (Does not reproduce)
//TODO connect animations to leaderboard data

//TODO implement leaderboard / Make it REALTIME
  //TINY collect user icons
  //TINY leaderboard appear animation
  //TODO allow users to select icons
//TODO add footer / Attribution / Legals
//TODO create long landing
//TODO change user menu after login
//TINY update socials

//TODO on load if daily is done already it probably won't get disabled by default

//TODO Hardcore test payment subscription flow
//TODO Pricing modal should handle when user is not signed in (for prompt especially)
//BUG Third random (prompt) breaks random button (MAYBE: dependent on problem one before)


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
      transition('initial => shrink', [animate('0.4s 0.1s ease-in')]),
    ]),
    trigger('slideInFromLeft', [
      transition(':enter', [
        style({ transform: 'translateX(-15rem)' }),
        animate('0.25s ease-out', style({ transform: 'translateX(0)' })),
      ]),
    ]),
    trigger('slideInFromRight', [
      transition(':enter', [
        style({ transform: 'translateX(15rem)' }),
        animate('0.25s ease-out', style({ transform: 'translateX(0)' })),
      ]),
    ]),
    trigger('scaleOut', [
      transition(':leave', [
        style({}),
        animate('0.3s ease-in', style({ height: '0', transform: 'scale(0)' })),
      ]),
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ transform: 'scale(0.3)', opacity: 0.4 }),
        animate('0.3s ease-in', style({ transform: 'scale(1)', opacity: 1 })),
      ]),
    ]),
    trigger('coinsAnimation', [
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateX(200px)' }),
            stagger(
              '100ms',
              animate(
                '701ms 200ms ease-out',
                style({ opacity: 1, transform: '' })
              )
            ),
          ],
          { optional: true }
        ),
      ]),
    ]),
    trigger('rotateScaleIn', [
      transition(':enter', [
        style({ transform: 'rotateX(80deg)', opacity: 0 }),
        animate(
          '0.5s 1s cubic-bezier(0.250, 0.460, 0.450, 0.940)',
          style({ transform: 'rotateX(0)', opacity: 1 })
        ),
      ]),
    ]),
    trigger('progressBarAnimation', [
      state('false', style({ opacity: 0 })),
      transition('* => true', [
        sequence([
          animate('0.3s ease-out', style({ opacity: 1 })),
          query('@fillPosition, @markerPosition', animateChild()),
        ]),
      ]),
    ]),
    trigger('fillPosition', [
      transition('* => true', [
        style({ transform: 'scaleX(0%)' }),
        animate('0.8s ease-in-out', style({ transform: 'scaleX(100%)' })),
      ]),
    ]),
    trigger('markerPosition', [
      state('true', style({ left: '56%' })),
      transition('* => true', [
        style({ left: '0%' }),
        animate('0.8s ease-in-out', style({ left: '56%' })),
      ]),
    ]),
    trigger('fadeIn', [
      state('false', style({ opacity: 0 })),
      state('true', style({ opacity: 1 })),
      transition('* => true', [
        style({ opacity: 0 }),
        animate('0.3s 0.5s ease-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class TierListComponent implements OnChanges {
  changeDetector = inject(ChangeDetectorRef);
  tierlistManager = inject(TierlistManagerService);
  _userManager = inject(UserManagerService);
  _activeRoute = inject(ActivatedRoute);
  router = inject(Router);
  modalController = inject(ModalControllerService);

  @Input() isDailyTierlist: boolean = false;
  @Input() tierlistItems: TierListItem[] = [];
  dailyTierlist?: TierList;
  @Output() tierlistTitle = new EventEmitter();
  @Output() completeTierlist = new EventEmitter()

  ngOnInit() {
    if (this.isDailyTierlist) {
      //OPTIMIZABLE if we would do a single HTTP call instead of two
      this.tierlistManager.fetchDailyTierlist().subscribe((res: any) => {
        if (res.length == 0) {
          this.router.navigate(['unauthorized/400']);
        } else {
          this.dailyTierlist = res[0] as TierList;
          this.tierlistTitle.emit(res[0].name);
          this.tierlistManager.fetchTierlist(res[0].id).subscribe((res: any) => {
            this.tierlistItems = res as TierListItem[];
            this.calcRows();
          });
        }
      });
    }
  }

  numOfRows?: number;

  calcRows() {
    this.numOfRows =
      this.tierlistItems.length <= 5
        ? 3
        : this.tierlistItems.length <= 8
          ? 5
          : 7;
    preloadImages(
      this.tierlistItems.map((item) => item.file_path),
      this.loadData
    );
  }

  ngOnChanges() {
    if (!this.numOfRows && this.tierlistItems.length != 0) {
      this.calcRows();
    }
  }

  array(n: number) {
    return Array(n);
  }

  loadData = {
    areImagesLoaded: false,
    numOfLoaded: 0,
  };

  placedAll = false;
  finished = false;

  getPrediction() {
    const prediction: Prediction[] = [];

    this.tierData.forEach((row, i) => {
      row.forEach((item, j) => {
        if (item) {
          prediction.push({
            tierlist_item_id: item.id,
            predicted_tier: i,
          });
        }
      });
    });

    return prediction;
  }

  @ViewChild('coinscontainer', { static: false }) coinsContainer?: ElementRef;

  coinsWidth = '268px';
  coins: number[] = [];
  showCoins = false;
  numOfPoints: number = 0;

  changeCoinsWidth(coins: number) {
    this.coinsWidth = 67 + (coins - 1) * 33.5 + 'px';
  }

  calculateMarkerColor(pointsReceived: number): MarkerColor {
    if (this.numOfRows != null) {
      switch (this.numOfRows) {
        case 3:
          switch (pointsReceived) {
            case 0:
              return MarkerColor.red;
            case 1:
              return MarkerColor.yellow;
            case 2:
              return MarkerColor.perfect;
            default:
              return MarkerColor.red;
          }
        case 5:
          switch (pointsReceived) {
            case 0:
              return MarkerColor.red;
            case 1:
              return MarkerColor.yellow;
            case 2:
              return MarkerColor.green;
            case 3:
              return MarkerColor.perfect;
            default:
              return MarkerColor.red;
          }
        case 7:
          switch (pointsReceived) {
            case 1:
              return MarkerColor.red;
            case 2:
              return MarkerColor.yellow;
            case 3:
              return MarkerColor.green;
            case 4:
              return MarkerColor.perfect;
            default:
              return MarkerColor.red;
          }
        default:
          return MarkerColor.red;
      }
    } else {
      return MarkerColor.red;
    }
  }

  finish() {
    this.finished = true;
    this.changeDetector.detectChanges();
    const predictionData = this.getPrediction();
    const topicID = this.isDailyTierlist
      ? this.dailyTierlist?.topic_ID
      : this._activeRoute.snapshot.paramMap.get('topicID');
    if (topicID) {
      this.tierlistManager
        .calculatePoints(
          Number(topicID),
          this.tierlistItems[0].tierlist_ID,
          predictionData
        )
        .subscribe((res: any) => {
          if (this.numOfRows) {
            res.predictions.forEach((prediction: Prediction) => {
              for (let i = 0; i < this.tierData.length; i++) {
                for (let j = 0; j < this.tierData[i].length; j++) {
                  if (this.tierData[i][j].id == prediction.tierlist_item_id) {
                    if (
                      prediction.points_for_item != undefined &&
                      prediction.correct_tier != undefined
                    ) {
                      this.tierData[i][j].result_marker_color =
                        this.calculateMarkerColor(prediction.points_for_item);
                      this.tierData[i][j].flip_marker =
                        prediction.correct_tier < prediction.predicted_tier;
                    }
                  }
                }
              }
            })
            if (this.isDailyTierlist) {
              this._userManager.isDailyComplete = true
            }
            this.numOfPoints = res.points;
            if (!this._userManager.isAnonymousUser) {
              this._userManager.getUserData().subscribe((res: any) => this._userManager.userData = res.data)
            } else {
              this._userManager.userData.push({ tierlist_ID: this.tierlistItems[0].tierlist_ID, collected_points: res.points, topic_ID: Number(topicID) })
            }
            const maxPoint =
              (this.numOfRows == 3 ? 2 : this.numOfRows == 5 ? 3 : 4) *
              this.tierlistItems.length;
            const numOfCoins = Math.round((this.numOfPoints / maxPoint) * 7);
            this.coins = Array.from({ length: numOfCoins + 1 }, (_, i) => i);
            this.changeCoinsWidth(numOfCoins + 1);
            this.showCoins = true;
            if (this.coinsContainer) {
              setTimeout(() => {
                if (this.coinsContainer) {
                  this.coinsContainer.nativeElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                  });
                }
              }, 50);
            }
          }
        });
    }
  }

  maxItems?: number;

  calculateMaxItems(rowWidth: number) {
    if (!this.maxItems) {
      this.maxItems = Math.floor(rowWidth / 104);
    }
  }

  getTooltip(rowIndex: number, index: number) {
    const tooltip = this.tierlistItems.find(
      (el) => el.file_path == this.tierData[rowIndex][index].file_path
    );
    if (tooltip) {
      return tooltip.name;
    } else {
      return 'Item';
    }
  }

  currentItem = 0;
  currentPlaceholder = 0;

  tiers = ['S', 'A', 'B', 'C', 'D', 'E', 'F'];
  backgroundColors = [
    '#FF3131',
    '#FF7518',
    '#FFBF00',
    '#32CD32',
    '#00FFFF',
    '#1F51FF',
    '#DA70D6',
  ];

  tierData: TierListItem[][] = Array.from({ length: 7 }, () => []);

  draggedFromRow?: number;
  draggedIndex?: number;

  onDragStart(rowIndex: number, index: number) {
    this.draggedFromRow = rowIndex;
    this.draggedIndex = index;
    this.currentPlaceholder = this.tierlistItems.findIndex(
      (item) => item.file_path == this.tierData[rowIndex][index].file_path
    );
  }

  showFiller: string[] = [
    'block',
    'block',
    'block',
    'block',
    'block',
    'block',
    'block',
  ];

  onDrop(e: DndDropEvent, rowIndex: number) {
    if (e.index != undefined) {
      if (e.type == 'import') {
        this.tierData[rowIndex].splice(e.index, 0, e.data);
        this.nextUp();
      } else {
        if (this.currentItem != this.currentPlaceholder) {
          this.currentPlaceholder = this.currentItem;
        }
        if (
          this.draggedFromRow != undefined &&
          this.draggedIndex != undefined
        ) {
          this.tierData[this.draggedFromRow].splice(this.draggedIndex, 1);
          this.tierData[rowIndex].splice(e.index, 0, e.data);
        }
      }
      this.calcShowFiller();
    }
    if (this.draggedFromRow != undefined) {
      this.draggedFromRow = undefined;
    }
  }

  nextUp() {
    if (this.currentItem == this.tierlistItems.length - 1) {
      this.placedAll = true;
    } else {
      this.currentItem += 1;
      this.currentPlaceholder += 1;
    }
  }

  calcShowFiller() {
    for (let i = 0; i < this.showFiller.length; i++) {
      if (this.tierData[i].length % 4 == 0 && this.tierData[i].length != 0) {
        this.showFiller[i] = 'none';
      } else {
        this.showFiller[i] = 'block';
      }
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  playRandomLevel() {
    if (this._userManager.isAnonymousUser) {
      if (!this._userManager.promptedToSignUp) {
        this._userManager.promptedToSignUp = true;
        this.modalController.showModal(ModalType.signUpPrompt_ON)
      }
      if (this._userManager.sessionCompletedTierlists == 3) {
        this.modalController.showModal(ModalType.pricing_ON)
      }
      this._userManager.sessionCompletedTierlists += 1
    } 

    this.tierlistManager.fetchRandomTierlist().subscribe((res: any) => {
      this.router
        .navigateByUrl('/', { skipLocationChange: true })
        .then(() =>
          this.router.navigate(
            [
              '/topics/' + res.topic_ID + '/tierlists/' + res.id,
              { title: res.name },
            ],
            { onSameUrlNavigation: 'reload' }
          )
        );
    });
  }

  //#region SUBMIT Animations
  animateProgressbar = false;
  showText1 = false;
  showText2 = false;
  showToTopButton = false;

  //OPTIMIZABLE tierlist submit animations can be unified easily
  startAnimatingProgressbar(e: any) {
    this.animateProgressbar = true;
  }
  startAnimatingText1(e: any) {
    if (e.toState == true) {
      this.showText1 = true;
    }
  }
  startAnimatingText2(e: any) {
    if (e.toState == true) {
      this.showText2 = true;
    }
  }
  startAnimatingToTopButton(e: any) {
    if (e.toState == true) {
      this.showToTopButton = true;
    }
  }
  //#endregion
}
