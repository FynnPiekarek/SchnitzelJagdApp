import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Task1Component } from '../task1/task1.component';
import { Task2Component } from '../task2/task2.component';
import { Task3Component } from '../task3/task3.component';
import { Task4Component } from '../task4/task4.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  imports: [
    Task1Component,
    Task2Component,
    Task3Component,
    Task4Component,
    NgIf,
  ],
})
export class GameComponent implements OnInit {
  currentTaskIndex: number = 1; // Default to Task 1

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    // Sync currentTaskIndex with the route on initialization
    console.log('Game Component');
    this.syncTaskIndexWithRoute();
  }

  // Sync the task index with the current route
  private syncTaskIndexWithRoute(): void {
    console.log('sync taskIndexWithRoute');

    const currentRoute = this.router.url; // Get the current route
    console.log(`Current route: ${currentRoute}`);

    const match = currentRoute.match(/\/task(\d+)/); // Extract task number from the route

    if (match) {
      this.currentTaskIndex = parseInt(match[1], 10); // Update currentTaskIndex
      console.log(`Updated currentTaskIndex: ${this.currentTaskIndex}`);
    } else {
      this.currentTaskIndex = 1; // Default to Task 1 if no match
      console.log('Defaulting to Task 1');
    }

    // Start the game or synchronize current task
    if (this.currentTaskIndex === 1) {
      this.startGame(); // Start the game if Task 1
    } else {
      // Navigate to the current task if already in progress
      this.navigateToTask(this.currentTaskIndex);
    }
  }


  // Start the game by navigating to the first task
  startGame(): void {
    console.log('started game');
    this.navigateToTask(this.currentTaskIndex);
  }

  // Handle task completion
  async onTaskCompleted(): Promise<void> {
    console.log('inside function'); // Ensure this is logged every time
    if (this.currentTaskIndex < 4) {
      this.currentTaskIndex++;
      console.log(`Task completed. Navigating to Task ${this.currentTaskIndex}`);
      this.navigateToTask(this.currentTaskIndex);
    } else {
      console.log('Navigating to win screen');
      this.navigateToWinScreen();
    }
  }



  // Navigate to the current task
  private navigateToTask(taskNumber: number): void {
    const route = `/task${taskNumber}`;
    console.log(`Navigating to ${route}`); // Debug log
    this.router.navigate([route]).then((success) => {
      if (!success) {
        console.error(`Navigation to ${route} failed`);
      }
    });
  }


  // Navigate to the win screen
  private navigateToWinScreen(): void {
    this.router.navigate(['/winscreen']).then((success) => {
      if (!success) {
        console.error('Navigation to winscreen failed');
      }
    });
  }
}
