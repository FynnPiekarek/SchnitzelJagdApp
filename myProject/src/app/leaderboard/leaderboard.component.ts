import { Component, OnInit } from '@angular/core';
import {Users} from "../mock-User";

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}


    protected readonly Users = Users;
}
