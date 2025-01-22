import { Component } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-task1',
  templateUrl: './task1.component.html',
  imports: [
    NgIf
  ],
  styleUrls: ['./task1.component.scss']
})
export class Task1Component {
  currentPosition: { latitude: number; longitude: number } | null = null;

  async getCurrentPosition() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      this.currentPosition = {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
      };
      console.log('Current position:', this.currentPosition);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  }
}
