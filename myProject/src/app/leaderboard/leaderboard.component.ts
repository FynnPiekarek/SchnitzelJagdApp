import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';
import { User } from '../User';
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
import {addIcons} from "ionicons";
import {personCircleOutline} from "ionicons/icons";
import {Capacitor} from "@capacitor/core";
import {Geolocation} from "@capacitor/geolocation";
import {Camera, CameraResultType, CameraPermissionType} from "@capacitor/camera";

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  imports: [
    IonList,
    IonLabel,
    IonListHeader,
    IonItem,
    IonAvatar,
    IonIcon,
    IonNote,
    IonButton
  ]
})
export class LeaderboardComponent implements OnInit {
  Users: User[] = [];
  AllUsers: User[] = [];
  nextUserId: number = 1;
  private _storage: Storage | null = null;

  constructor(private alertController: AlertController, private storage: Storage) {
    addIcons({personCircleOutline})
  }

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
      booms: 0,
    };

    this.AllUsers.push(newUser);
    this.saveUsers().then(r => this.Users);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Before we start',
      message: 'Please enter your name to start the game',
      inputs: [
        {
          name: 'username',
          type: 'text',
          placeholder: 'Enter your name',
          attributes: {
            id: 'username-input',
          },
        },
      ],
      buttons: [
        {
          text: 'Quit',
          role: 'cancel',
          handler: () => {
            console.log('Game exited by user');
          },
        },
        {
          text: 'Save',
          handler: (data) => {
            if (data.username) {
              this.addUser(data.username);
              this.showAllowAccessAlert()
            }
          },
          cssClass: 'save-button',
          role: 'save',
        },
      ],
    });

    await alert.present();

    const inputElement = document.getElementById('username-input') as HTMLInputElement;
    const saveButton = document.getElementsByClassName('save-button')[0] as HTMLButtonElement;

    inputElement.addEventListener('input', () => {
      saveButton.disabled = !inputElement.value.trim();
    });
  }

  async showAllowAccessAlert() {
    const alert = await this.alertController.create({
      header: 'Zugriffsanfrage erforderlich',
      message: 'Möchtest du den Zugriff auf die Kamera und den Standort erlauben?',
      buttons: [
        {
          text: 'Ablehnen',
          role: 'cancel',
          handler: () => {
            console.log('Berechtigungen wurden abgelehnt');
          },
        },
        {
          text: 'Erlauben',
          handler: () => {
            this.requestPermissions();
          },
        },
      ],
    });

    await alert.present();
  }

  async requestPermissions() {
    try {
      if (Capacitor) {
        const geoPermission = await Geolocation.requestPermissions();
        console.log('Standortberechtigung:', geoPermission);

        const cameraPermission = await Camera.requestPermissions();
        console.log('Kameraberechtigung:', cameraPermission);

      } else {
        console.warn('Berechtigungen können nur auf nativen Plattformen angefordert werden.');
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
