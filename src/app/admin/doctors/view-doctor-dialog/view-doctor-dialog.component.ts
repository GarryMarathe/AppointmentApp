import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { Doctor } from '../doctors.component';
import { CommonModule } from '@angular/common';
import { Specialty } from '../../specialities/specialities.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-view-doctor-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogActions, MatDialogContent, MatIconModule, MatButtonModule],
  templateUrl: './view-doctor-dialog.component.html',
  styleUrls: ['./view-doctor-dialog.component.css']
})
export class ViewDoctorDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { doctor: Doctor, specialties: Specialty[] },
    private dialogRef: MatDialogRef<ViewDoctorDialogComponent>,
  ) {}

  getSpecializationName(specializationId: string): string {
    const specialty = this.data.specialties.find(s => s.id === specializationId);
    return specialty ? specialty.name : 'Unknown';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}