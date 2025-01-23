import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { haversineDistance } from '../geolocation.utils';
import { ChangeDetectorRef } from '@angular/core';
import {NgIf, NgStyle} from "@angular/common";
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import {IonButton, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import { Dialog } from '@capacitor/dialog';

const EXPECTED_COORDS = {
  latitude: 47.071945403994924,
  longitude: 8.348885173299777,
};

@Component({
  selector: 'app-task1',
  templateUrl: './task1.component.html',
  styleUrls: ['./task1.component.scss']
})
export class Task1Component {
  currentPosition: { latitude: number; longitude: number } | null = null;
  watchId: string | null = null;
  distanceToTarget: number = 0; // Default to 0
  isInTargetArea: boolean = false;

  constructor(private cdr: ChangeDetectorRef, private router: Router) {}

  async ngOnInit() {
    await this.startWatchingPosition();
  }

  async startWatchingPosition() {
    try {
      // Start watching position with high accuracy enabled
      this.watchId = await Geolocation.watchPosition(
        { enableHighAccuracy: true },
        (position, err) => {
          if (position) {
            // Update current position
            const { latitude, longitude } = position.coords;
            this.currentPosition = { latitude, longitude };

            // Calculate distance to target
            this.distanceToTarget = haversineDistance(this.currentPosition, EXPECTED_COORDS);

            // Check if in target area (within 10 meters)
            this.isInTargetArea = this.distanceToTarget <= 10;

            // Trigger manual change detection to ensure view updates
            this.cdr.detectChanges();
          } else if (err) {
            console.error('Error getting location:', err);
          }
        }
      );
    } catch (error) {
      console.error('Error starting position watcher:', error);
    }
  }

  stopWatchingPosition() {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
      console.log('Location tracking stopped.');
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
      this.router.navigate(['/1task']); // Redirect to /home
    }
  }

  async showInfoDialog() {
    await Dialog.alert({
      title: 'Information',
      message: 'Search and go to the Pingpong Table outside.',
      buttonTitle: 'Continue',
    });
  }

}
