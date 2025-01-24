import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { haversineDistance } from '../geolocation.utils';
import { ChangeDetectorRef } from '@angular/core';
import { NgIf, NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Dialog } from '@capacitor/dialog';

const EXPECTED_COORDS = {
  latitude: 47.071945403994924,
  longitude: 8.348885173299777,
};
/*const EXPECTED_COORDS = {
  latitude: 47.039548,
  longitude: 8.322323,
};*/

@Component({
  selector: 'app-task1',
  templateUrl: './task1.component.html',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    NgStyle,
    IonIcon,
  ],
  styleUrls: ['./task1.component.scss'],
})
export class Task1Component implements OnInit {
  @Output() taskCompleted = new EventEmitter<void>();
  currentTaskIndex: number = 1;

  currentPosition: { latitude: number; longitude: number } | null = null;
  watchId: string | null = null;
  distanceToTarget: number = 0;
  isInTargetArea: boolean = false;
  isTaskComplete: boolean = false; // Ensure task completion state is preserved

  constructor(private cdr: ChangeDetectorRef, private router: Router) {}

  async ngOnInit() {
    await this.startWatchingPosition();
  }

  async startWatchingPosition() {
    try {
      this.watchId = await Geolocation.watchPosition(
        { enableHighAccuracy: true },
        (position, err) => {
          if (position) {
            const { latitude, longitude } = position.coords;
            this.currentPosition = { latitude, longitude };

            this.distanceToTarget = haversineDistance(this.currentPosition, EXPECTED_COORDS);

            this.isInTargetArea = this.distanceToTarget <= 1000;

            this.cdr.detectChanges();

            if (this.isInTargetArea && !this.isTaskComplete) {
              this.completeTask(); // Trigger task completion if in the target area
            }

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
      this.router.navigate(['/home']); // Redirect to home or another route
    }
  }

  async showInfoDialog() {
    await Dialog.alert({
      title: 'Information',
      message: 'Search and go to the Pingpong Table outside.',
      buttonTitle: 'Continue',
    });
  }

  private completeTask() {
    this.isTaskComplete = true; // Ensure the task cannot be reverted
    this.stopWatchingPosition(); // Stop tracking position to preserve resources
    this.taskCompleted.emit(); // Notify parent component that task is completet
  }
}
