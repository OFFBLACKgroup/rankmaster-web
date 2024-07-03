import { Routes } from '@angular/router';
import { BeforeLaunchComponent } from './routes/before-launch/before-launch.component';
import { MainMenuComponent } from './routes/main-menu/main-menu.component';
import { LevelsComponent } from './routes/levels/levels.component';
import { DailyComponent } from './routes/daily/daily.component';
import { LeaderboardComponent } from './routes/leaderboard/leaderboard.component';

export const routes: Routes = [
  { path: 'menu', component: MainMenuComponent},
  { path: 'levels', component: LevelsComponent},
  { path: 'daily', component: DailyComponent},
  { path: 'leaderboard', component: LeaderboardComponent},
  { path: '', component: BeforeLaunchComponent},
];
