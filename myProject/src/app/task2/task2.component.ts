import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { haversineDistance } from '../geolocation.utils';
import { ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Dialog } from '@capacitor/dialog';
import { IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-task2',
  templateUrl: './task2.component.html',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    NgStyle,
    IonIcon,
  ],
  styleUrls: ['./task2.component.scss'],
})
export class Task2Component implements OnInit {
  @Output() taskCompleted = new EventEmitter<void>(); // Emit a void event


  startingPosition: { latitude: number; longitude: number } | null = null;
  currentPosition: { latitude: number; longitude: number } | null = null;
  distanceFromStart: number = 0; // Distance from the starting position
  isFarEnough: boolean = false; // Indicates if the user is 10m away
  isTaskComplete: boolean = false; // Ensure task completion state is preserved
  watchId: string | null = null; // ID for geolocation watcher
  taskIndex: number = 2; // Default task index for this component

  constructor(
      private cdr: ChangeDetectorRef,
      private router: Router,
      private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('Task2Component initialized');
    this.syncTaskIndexWithRoute();
    this.setStartingPosition();
    this.trackPosition();
  }


  // Sync task index with the route
  private syncTaskIndexWithRoute(): void {
    this.route.queryParams.subscribe((params) => {
      this.taskIndex = params['taskIndex'] ? +params['taskIndex'] : this.taskIndex;
    });
  }

  // Set the starting position when the component loads
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

  // Track the current position and calculate the distance from the starting position
  async trackPosition() {
    try {
      this.watchId = await Geolocation.watchPosition(
          { enableHighAccuracy: true },
          (position, err) => {
            if (position) {
              const { latitude, longitude } = position.coords;
              this.currentPosition = { latitude, longitude };

              if (this.startingPosition) {
                this.distanceFromStart = haversineDistance(this.startingPosition, this.currentPosition);
                console.log('Distance from start:', this.distanceFromStart);

                // Check if the user is at least 10m away
                this.isFarEnough = this.distanceFromStart >= 0;

                if (this.isFarEnough && !this.isTaskComplete) {
                  console.log('Far Enough');
                  this.completeTask();
                }

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

  // Stop tracking the position
  stopTracking() {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
      console.log('Position tracking stopped.');
    }
  }

  // Show the exit dialog
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

  // Show information about the task
  async showInfoDialog() {
    await Dialog.alert({
      title: 'Information',
      message: 'Walk 10 meters away from your starting position to complete this task.',
      buttonTitle: 'Continue',
    });
  }

  // Mark the task as complete and emit the event to navigate
  private completeTask() {
    console.log('inside complete task'); // Debug log
    this.isTaskComplete = true; // Prevent reverting the task state
    this.stopTracking(); // Stop tracking to optimize resources
    console.log('after stop tracking'); // Debug log
    setTimeout(() => {
      try {
        console.log('emitting taskCompleted'); // Debug log
        this.taskCompleted.emit(); // Emit the event
      } catch (error) {
        console.error('Error emitting taskCompleted event:', error);
      }
      console.log('completed task completed');
    }, 3000); // Wait 3 seconds before emitting the event
  }
}
