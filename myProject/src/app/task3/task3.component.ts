import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';

@Component({
  selector: 'app-task3',
  templateUrl: './task3.component.html',
  styleUrls: ['./task3.component.scss'],
})
export class Task3Component {
  @Output() taskCompleted = new EventEmitter<void>();

  private readonly VALID_QR_CODE = 'M335@ICT-BZ';
  isTaskComplete: boolean = false; // Ensure the task completion state is preserved
  taskIndex: number = 3; // Default task index for this component

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.syncTaskIndexWithRoute(); // Sync task index with route on initialization
  }

  // Sync the task index with the current route
  private syncTaskIndexWithRoute(): void {
    this.route.queryParams.subscribe((params) => {
      this.taskIndex = params['taskIndex'] ? +params['taskIndex'] : this.taskIndex;
    });
  }

  async scanQRCode(): Promise<void> {
    try {
      // Start scanning for QR codes
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: 0, // Use QR_CODE enum value from Html5QrcodeSupportedFormats (0 = QR_CODE)
      });

      // Validate the scanned QR code
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
    }
  }

  private completeTask(): void {
    this.isTaskComplete = true; // Ensure the task cannot be reverted
    this.taskCompleted.emit(); // Notify parent component (GameComponent) of task completion
  }
}
