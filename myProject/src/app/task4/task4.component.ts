import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { Device } from '@capacitor/device';
import { Dialog } from '@capacitor/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { NgStyle } from '@angular/common';

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
    IonIcon,
  ],
})
export class Task4Component implements OnInit, OnDestroy {
  @Output() taskCompleted = new EventEmitter<void>();

  isPluggedIn: boolean = false; // Track if the phone is plugged in
  isTaskComplete: boolean = false; // Ensure the task completion state is preserved
  batteryCheckInterval: any; // Variable to hold the interval reference
  taskIndex: number = 4; // Default task index for this component

  constructor(private router: Router, private route: ActivatedRoute) {}

  async ngOnInit() {
    this.syncTaskIndexWithRoute(); // Sync task index with the route

    await this.checkIfPluggedIn();

    // Start polling battery status every 1 second
    this.batteryCheckInterval = setInterval(async () => {
      await this.checkIfPluggedIn();

      // Check if the task is complete
      if (this.isPluggedIn && !this.isTaskComplete) {
        this.completeTask();
      }
    }, 1000);
  }

  // Sync the task index with the current route
  private syncTaskIndexWithRoute(): void {
    this.route.queryParams.subscribe((params) => {
      this.taskIndex = params['taskIndex'] ? +params['taskIndex'] : this.taskIndex;
    });
  }

  // Check if the phone is plugged in
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

  // Mark the task as complete
  private completeTask() {
    this.isTaskComplete = true; // Prevent the task from being reverted
    clearInterval(this.batteryCheckInterval); // Stop polling the battery status

    this.taskCompleted.emit(); // Notify the parent component (GameComponent) of task completion
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
