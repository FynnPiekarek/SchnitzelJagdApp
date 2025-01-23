import { Component, OnInit, OnDestroy } from '@angular/core';
import { Device } from '@capacitor/device';
import { Dialog } from '@capacitor/dialog';
import { Router } from '@angular/router';
import {IonContent, IonHeader, IonIcon, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-task4',
  templateUrl: './task4.component.html',
  styleUrls: ['./task4.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    NgStyle,
    IonIcon
  ]
})
export class Task4Component implements OnInit, OnDestroy {
  isPluggedIn: boolean = false; // Track if the phone is plugged in
  batteryCheckInterval: any; // Variable to hold the interval reference

  constructor(private router: Router) {}

  async ngOnInit() {
    await this.checkIfPluggedIn();

    // Start polling battery status every 1 second
    this.batteryCheckInterval = setInterval(async () => {
      await this.checkIfPluggedIn();
    }, 1000);
  }

  async checkIfPluggedIn() {
    try {
      const batteryInfo = await Device.getBatteryInfo();
      this.isPluggedIn = batteryInfo.isCharging ?? false; // Assign default if undefined
      console.log('Phone plugged in:', this.isPluggedIn);
    } catch (error) {
      console.error('Error checking battery info:', error);
      this.isPluggedIn = false; // Default to false on error
    }
  }

  ngOnDestroy() {
    // Clear the interval when the component is destroyed
    if (this.batteryCheckInterval) {
      clearInterval(this.batteryCheckInterval);
    }
  }

  async showExitDialog() {
    const { value } = await Dialog.confirm({
      title: 'Exit Task',
      message: 'Are you sure you want to exit?',
      okButtonTitle: 'Yes',
      cancelButtonTitle: 'No',
    });

    if (value) {
      this.router.navigate(['/home']); // Redirect to home
    }
  }

  async showInfoDialog() {
    await Dialog.alert({
      title: 'Information',
      message: 'Plug your phone in to see the green circle!',
      buttonTitle: 'Close',
    });
  }
}
