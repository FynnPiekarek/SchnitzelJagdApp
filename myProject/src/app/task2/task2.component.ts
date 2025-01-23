import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { haversineDistance } from '../geolocation.utils';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Dialog } from '@capacitor/dialog';
import { IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { NgStyle } from "@angular/common";

@Component({
  selector: 'app-task2',
  templateUrl: './task2.component.html',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    NgStyle,
    IonIcon
  ],
  styleUrls: ['./task2.component.scss']
})
export class Task2Component implements OnInit {
  startingPosition: { latitude: number; longitude: number } | null = null;
  currentPosition: { latitude: number; longitude: number } | null = null;
  distanceFromStart: number = 0; // Distance from starting position
  isFarEnough: boolean = false; // Whether the user is 10m away
  watchId: string | null = null; // Declare the watchId property here

  constructor(private cdr: ChangeDetectorRef, private router: Router) {}

  async ngOnInit() {
    await this.setStartingPosition();
    await this.trackPosition();
  }

  async setStartingPosition() {
    try {
      const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      const { latitude, longitude } = position.coords;
      this.startingPosition = { latitude, longitude };
      console.log('Starting position set:', this.startingPosition);
    } catch (error) {
      console.error('Error getting starting position:', error);
    }
  }

  async trackPosition() {
    try {
      this.watchId = await Geolocation.watchPosition(
        { enableHighAccuracy: true },
        (position, err) => {
          if (position) {
            const { latitude, longitude } = position.coords;
            this.currentPosition = { latitude, longitude };

            // Calculate distance from the starting position
            if (this.startingPosition) {
              this.distanceFromStart = haversineDistance(this.startingPosition, this.currentPosition);
              console.log('Distance from start:', this.distanceFromStart);

              // Check if the user is at least 10m away
              this.isFarEnough = this.distanceFromStart >= 10;

              // Trigger manual change detection to update UI
              this.cdr.detectChanges();
            }
          } else if (err) {
            console.error('Error tracking position:', err);
          }
        }
      );
    } catch (error) {
      console.error('Error starting position tracking:', error);
    }
  }

  stopTracking() {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
      console.log('Position tracking stopped.');
    }
  }

  async showExitDialog() {
    const { value } = await Dialog.confirm({
      title: 'Exit Run',
      message: 'Are you sure you want to exit your current run?',
      okButtonTitle: 'Yes',
      cancelButtonTitle: 'No',
    });

    if (value) {
      this.router.navigate(['/home']); // Redirect to /home
    }
  }

  async showInfoDialog() {
    await Dialog.alert({
      title: 'Information',
      message: 'Walk 10 meters away from your starting position to complete this task.',
      buttonTitle: 'Continue',
    });
  }
}
