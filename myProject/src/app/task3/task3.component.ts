import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';
import { Dialog } from '@capacitor/dialog';
import {IonContent, IonHeader, IonIcon, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-task3',
  templateUrl: './task3.component.html',
  styleUrls: ['./task3.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    NgClass,
    IonIcon
  ]
})
export class Task3Component {
  @Output() taskCompleted = new EventEmitter<void>();

  private readonly VALID_QR_CODE = 'M335@ICT-BZ';
  isTaskComplete: boolean = false; // Task completion state
  taskIndex: number = 3; // Update to reflect 3/4
  isScanning: boolean = false; // To manage button state

  constructor(private router: Router) {}

  async scanQRCode(): Promise<void> {
    try {
      this.isScanning = true; // Set button to scanning state (red -> green)

      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: 0, // Use QR_CODE enum value (0 = QR_CODE)
      });

      if (result?.ScanResult) {
        if (result.ScanResult === this.VALID_QR_CODE && !this.isTaskComplete) {
          this.completeTask();
        } else {
          alert('Invalid QR Code.');
        }
      } else {
        alert('No QR Code detected.');
      }
    } catch (error) {
      console.error('Error during QR Code scanning:', error);
      alert('An error occurred while scanning. Please try again.');
    } finally {
      this.isScanning = false; // Revert button to red
    }
  }

  private completeTask(): void {
    this.isTaskComplete = true;
    console.log('HEREHERE')
    this.taskCompleted.emit();
  }

  async showExitDialog(): Promise<void> {
    const { value } = await Dialog.confirm({
      title: 'Exit Task',
      message: 'Are you sure you want to exit?',
      okButtonTitle: 'Yes',
      cancelButtonTitle: 'No',
    });

    if (value) {
      await this.router.navigate(['/home']); // Redirect to home
    }
  }

  async showInfoDialog(): Promise<void> {
    await Dialog.alert({
      title: 'Information',
      message: 'Walk 10 meters away from your starting position to complete this task.',
      buttonTitle: 'Continue',
    });
  }
}
