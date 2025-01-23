import { Component } from '@angular/core';
import { BarcodeScanner } from '@capacitor/barcode-scanner';
import { Dialog } from '@capacitor/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task3',
  templateUrl: './task3.component.html',
  styleUrls: ['./task3.component.scss'],
})
export class Task3Component {
  scannedCode: string | null = null; // Holds the scanned QR code
  isCorrectCode: boolean = false; // Flag for the correct QR code
  isScanning: boolean = false; // Indicates scanning state

  constructor(private router: Router) {}

  async startScan() {
    try {
      // Request permission for camera access
      const status = await BarcodeScanner.checkPermission({ force: true });

      if (status.granted) {
        // Start scanning
        this.isScanning = true;
        const result = await BarcodeScanner.startScan();

        // Stop scanning after obtaining result
        this.isScanning = false;

        // Process scanned content
        if (result.hasContent) {
          this.scannedCode = result.content;
          this.isCorrectCode = this.scannedCode === 'M335@ICT-BZ';

          if (this.isCorrectCode) {
            await Dialog.alert({
              title: 'Success',
              message: 'You scanned the correct QR code!',
              buttonTitle: 'Continue',
            });
          } else {
            await Dialog.alert({
              title: 'Error',
              message: 'Incorrect QR code. Please try again.',
              buttonTitle: 'OK',
            });
          }
        } else {
          await Dialog.alert({
            title: 'Error',
            message: 'No QR code detected. Please try again.',
            buttonTitle: 'OK',
          });
        }
      } else {
        await Dialog.alert({
          title: 'Permission Denied',
          message: 'Camera access is required to scan QR codes.',
          buttonTitle: 'OK',
        });
      }
    } catch (error) {
      console.error('Error scanning QR code:', error);
      this.isScanning = false;
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
      this.router.navigate(['/home']); // Navigate to home route
    }
  }

  async showInfoDialog() {
    await Dialog.alert({
      title: 'Information',
      message: 'Scan the correct QR code with the content "M335@ICT-BZ".',
      buttonTitle: 'OK',
    });
  }
}
