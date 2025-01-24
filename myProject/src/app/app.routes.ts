import { Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { Task1Component } from './task1/task1.component';
import { Task2Component } from './task2/task2.component';
import { Task3Component } from './task3/task3.component';
import { Task4Component } from './task4/task4.component';
import { WinscreenComponent } from './winscreen/winscreen.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import {provideStorage } from '@ionic/storage-angular';
import { PLATFORM_ID } from '@angular/core';


export const routes: Routes = [
  {
    path: '', component: GameComponent,
  },

  { path: 'game', component: GameComponent },
  { path: 'task1', component: Task1Component },
  { path: 'task2', component: Task2Component },
  { path: 'task3', component: Task3Component },
  { path: 'task4', component: Task4Component },
  { path: 'winscreen', component: WinscreenComponent },
];
