import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Doctor, Specialty } from '../../../model';


@Component({
  selector: 'app-view-doctor-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogActions, MatDialogContent, MatIconModule, MatButtonModule],
  templateUrl: './view-doctor-dialog.component.html',
  styleUrls: ['./view-doctor-dialog.component.css']
})
export class ViewDoctorDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { doctor: Doctor },
    private dialogRef: MatDialogRef<ViewDoctorDialogComponent>,
  ) {}

  // getSpecializationName(specializationId: string): string {
  //   const specialty = this.data.specialties.find(s => s._id === specializationId);
  //   return specialty ? specialty.name : 'Unknown';
  // }

  parseAvailability(availabilityData: any[]) {
    if (!availabilityData || !Array.isArray(availabilityData)) {
      return {
        availabilityDays: 'Not specified',
        timeSlot: {
          startTime: 'Not specified',
          endTime: 'Not specified'
        }
      };
    }
  
    try {
      // Assuming timeSlots array exists and is non-empty
      const firstTimeSlot = availabilityData[0]?.timeSlots[0];
      const lastTimeSlot = availabilityData[0]?.timeSlots[availabilityData[0].timeSlots.length - 1];
  
      return {
        availabilityDays: availabilityData.map(item => item.day).join(", "),
        timeSlot: {
          startTime: firstTimeSlot ? firstTimeSlot.startTime : 'Not specified',
          endTime: lastTimeSlot ? lastTimeSlot.endTime : 'Not specified'
        }
      };
    } catch (error) {
      console.error('Error parsing availability data:', error);
      return {
        availabilityDays: 'Not specified',
        timeSlot: {
          startTime: 'Not specified',
          endTime: 'Not specified'
        }
      };
    }
  }
  
  closeDialog(): void {
    this.dialogRef.close();
  }
}