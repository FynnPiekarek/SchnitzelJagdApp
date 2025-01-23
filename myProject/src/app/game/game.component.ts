import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {Task1Component} from "../task1/task1.component";
import {Task2Component} from "../task2/task2.component";
import {Task3Component} from "../task3/task3.component";
import {Task4Component} from "../task4/task4.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  imports: [
    Task1Component,
    Task2Component,
    Task3Component,
    Task4Component,
    NgIf
  ]
})
export class GameComponent {
  currentTaskIndex: number = 1; // Start with Task 1

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startGame();
  }

  // Start the game by navigating to the first task
  startGame(): void {
    this.navigateToTask(this.currentTaskIndex);
  }

  // Handle task completion
  async onTaskCompleted(): Promise<void> {
    if (this.currentTaskIndex < 4) {
      this.currentTaskIndex++;
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
