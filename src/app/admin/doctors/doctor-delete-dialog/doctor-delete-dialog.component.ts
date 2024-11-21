import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-doctor-delete-dialog',
  standalone: true,
  imports: [MatDialogActions, MatButtonModule, MatDialogContent],
  templateUrl: './doctor-delete-dialog.component.html',
  styleUrls: ['./doctor-delete-dialog.component.css']
})
export class DoctorDeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DoctorDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number; name: string },
    private snackBar: MatSnackBar
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
    this.snackBar.open(`Doctor "${this.data.name}" deleted successfully!`, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}