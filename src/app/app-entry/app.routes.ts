import { Routes } from '@angular/router';
import { BeforeLaunchComponent } from '../routes/before-launch/before-launch.component';
import { MainMenuComponent } from '../routes/main-menu/main-menu.component';
import { TopicsComponent } from '../routes/main-menu/topics/topics.component';
import { DailyComponent } from '../routes/main-menu/daily/daily.component';
import { LeaderboardComponent } from '../routes/main-menu/leaderboard/leaderboard.component';
import { TopicTierlistsComponent } from '../routes/main-menu/topics/topic-tierlists/topic-tierlists.component';
import { PlayTierlistComponent } from '../routes/main-menu/topics/topic-tierlists/play-tierlist/play-tierlist.component';
import { routeGuard } from '../services/routeGuard/route.guard';
import { UnauthorizedComponent } from '../routes/unauthorized/unauthorized.component';

export const routes: Routes = [
  { path: '', component: BeforeLaunchComponent},
  {
    path: '',
    canActivate: [routeGuard],
    children: [
      { path: 'menu', component: MainMenuComponent},
      { path: 'topics/:id', component: TopicTierlistsComponent },
      { path: 'topics', component: TopicsComponent },
      { path: 'daily', component: DailyComponent },
      { path: 'leaderboard', component: LeaderboardComponent },
    ]
  },
  { path: 'topics/:topicID/tierlists/:id', component: PlayTierlistComponent, canActivate: [routeGuard], data: { isPremium: true},  },
  { path: 'unauthorized/:id', component: UnauthorizedComponent},
  { path: '**', component: UnauthorizedComponent }
];
