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
    this.syncTaskIndexWithRoute();
  }

  // Sync the task index with the current route
  private syncTaskIndexWithRoute(): void {
    const currentRoute = this.router.url; // Get the current route
    const match = currentRoute.match(/\/task(\d+)/); // Extract task number from the route
    if (match) {
      this.currentTaskIndex = parseInt(match[1], 10); // Update currentTaskIndex
    } else {
      this.currentTaskIndex = 1; // Default to Task 1 if no match
    }

    // Start the game by navigating to the first task (if needed)
    if (this.currentTaskIndex === 1) {
      this.startGame();
    }
  }

  // Start the game by navigating to the first task
  startGame(): void {
    this.navigateToTask(this.currentTaskIndex);
  }

  // Handle task completion
  async onTaskCompleted(): Promise<void> {
    if (this.currentTaskIndex < 4) {
      this.currentTaskIndex++;
      console.log(`Task completed. Navigating to Task ${this.currentTaskIndex}`);
      this.navigateToTask(this.currentTaskIndex);
    } else {
      this.navigateToWinScreen();
    }
  }

  // Navigate to the current task
  private navigateToTask(taskNumber: number): void {
    const route = `/task${taskNumber}`;
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
