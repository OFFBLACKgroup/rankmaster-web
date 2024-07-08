import { Routes } from '@angular/router';
import { BeforeLaunchComponent } from './routes/before-launch/before-launch.component';
import { MainMenuComponent } from './routes/main-menu/main-menu.component';
import { TopicsComponent } from './routes/topics/topics.component';
import { DailyComponent } from './routes/daily/daily.component';
import { LeaderboardComponent } from './routes/leaderboard/leaderboard.component';
import { TopicTierlistsComponent } from './routes/topics/topic-tierlists/topic-tierlists.component';

export const routes: Routes = [
  { path: 'menu', component: MainMenuComponent},
  { path: 'topics/:id', component: TopicTierlistsComponent},
  { path: 'topics', component: TopicsComponent},
  { path: 'daily', component: DailyComponent},
  { path: 'leaderboard', component: LeaderboardComponent},
  { path: '', component: BeforeLaunchComponent},
];
