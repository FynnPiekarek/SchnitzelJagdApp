import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { User } from '../User';
import { Geolocation } from '@capacitor/geolocation';
import { Camera } from '@capacitor/camera';
import { Dialog } from '@capacitor/dialog';
import {Router} from "@angular/router";
import {
  IonAvatar,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote
} from "@ionic/angular/standalone";
import {routes} from "../app.routes";

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  imports: [
    IonList,
    IonListHeader,
    IonLabel,
    IonItem,
    IonAvatar,
    IonIcon,
    IonNote,
    IonButton
  ],
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  Users: User[] = [];
  AllUsers: User[] = [];
  nextUserId: number = 1;
  private _storage: Storage | null = null;

  constructor(private storage: Storage, private router:Router) {}

  async ngOnInit() {
    this._storage = await this.storage.create();
    await this.loadUsers();
    this.nextUserId = this.AllUsers.length + 1;
  }

  private async loadUsers() {
    const storedUsers = await this._storage?.get('users');
    this.AllUsers = storedUsers || [];
    this.displayTopUsers();
  }

  async saveUsers() {
    await this._storage?.set('users', this.AllUsers);
  }

  addUser(name: string) {
    const newUser: User = {
      id: this.nextUserId++,
      name: name,
      time: 0,
      booms: 0
    };

    this.AllUsers.push(newUser);
    this.saveUsers().then(r => this.Users);
  }

  /** Haupt-Funktion: Erster Alert zur Eingabe des Namens, dann Zugriffsanfrage */
  async startGame() {
    // Prompt zum Eingeben des Namens
    const { value: username, cancelled } = await Dialog.prompt({
      title: 'Before we start',
      message: 'Please enter your name to start the game:',
      inputPlaceholder: 'Enter your name'
    });

    if (cancelled) {
      console.log('Spiel abgelehnt');
      return; // Abbrechen, wenn der User den Prompt abbricht
    }

    if (username?.trim()) {
      this.addUser(username); // Name zur Liste hinzufügen
      this.showAllowAccessDialog(); // Nächster Dialog für Zugriffserlaubnis
    } else {
      await Dialog.alert({
        title: 'Error',
        message: 'Bitte gib einen gültigen Namen ein!'
      });
    }
  }

  /** Zweiter Alert: Zugriff auf Standort und Kamera */
  async showAllowAccessDialog() {
    const { value } = await Dialog.confirm({
      title: 'Zugriffsanfrage erforderlich',
      message: 'Möchtest du der App Zugriff auf Kamera und Standort erlauben?'
    });

    if (value) {
      console.log('Zugriff akzeptiert');
      this.requestPermissions(); // Berechtigungen anfordern
    } else {
      console.log('Berechtigungen wurden abgelehnt');
    }
  }

  /** Zugriff auf Standort und Kamera-Berechtigungen anfordern */
  async requestPermissions() {
    try {
      // Standort-Berechtigung anfordern
      const geoPermission = await Geolocation.requestPermissions();
      console.log('Standortberechtigung:', geoPermission);

      // Kamera-Berechtigung anfordern
      const cameraPermission = await Camera.requestPermissions({permissions:['camera']});
      console.log('Kameraberechtigung:', cameraPermission);

      if(geoPermission.location && cameraPermission.camera == 'granted') {
        this.router.navigate(['game']);
      }

    } catch (error) {
      console.error('Fehler beim Anfordern der Berechtigungen:', error);
    }
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
    this.displayAllUsers();
  }
}
