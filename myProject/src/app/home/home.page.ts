import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import {LeaderboardComponent} from "../leaderboard/leaderboard.component";
import {Task1Component} from "../task1/task1.component";
import {Task2Component} from "../task2/task2.component";
import {Task4Component} from "../task4/task4.component";
import {Task3Component} from "../task3/task3.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, LeaderboardComponent, Task1Component, Task2Component, Task4Component, Task3Component],
})
export class HomePage {
  constructor() {}
}
