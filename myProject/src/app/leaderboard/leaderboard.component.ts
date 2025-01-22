import { Component, OnInit } from '@angular/core';
import {Users} from "../mock-User";
import {
    IonAvatar, IonBackButton, IonButton,
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonNote
} from "@ionic/angular/standalone";
import {addIcons} from "ionicons";
import {personCircleOutline} from "ionicons/icons";
import {User} from "../User";

@Component({
    selector: 'app-leaderboard',
    templateUrl: './leaderboard.component.html',
    styleUrls: ['./leaderboard.component.scss'],
    imports: [
        IonContent,
        IonList,
        IonLabel,
        IonIcon,
        IonItem,
        IonAvatar,
        IonNote,
        IonListHeader,
        IonButton,
        IonBackButton
    ]
})
export class LeaderboardComponent  implements OnInit {

  constructor() {
      addIcons({personCircleOutline})
      this.handleUserDisplay();
  }

  ngOnInit() {
      //this.sortFiveUserByTime();
  }

  Users = Users;
  AllUsers:User[] = Users;

  //sortFiveUserByTime(){
  //    this.Users.sort((a,b) => a.time - b.time);
  //    this.Users = this.Users.slice(0,5)
//
  //}

  //sortAllUserByTime(){
//
  //    console.log("working");
  //    console.log(this.AllUsers);
  //    this.AllUsers.sort((a,b) => a.time - b.time);
  //}

    async handleUserDisplay(): Promise<void> {
        this.displayTopUsers();
        await this.waitForButtonClick();
        this.displayAllUsers();
    }

    waitForButtonClick(): Promise<void> {
        return new Promise((resolve) => {
            document.addEventListener('showAllUsers', () => resolve());
        });
    }

    displayTopUsers(): void {
        this.Users = [...this.AllUsers];
        this.Users.sort((a, b) => a.time - b.time);
        this.Users = this.Users.slice(0, 5);
    }

    displayAllUsers(): void {
        this.Users = [...this.AllUsers];
        this.Users.sort((a, b) => a.time - b.time);
    }

    onButtonClick(): void {
        const event = new Event('showAllUsers');
        document.dispatchEvent(event);
    }




}
