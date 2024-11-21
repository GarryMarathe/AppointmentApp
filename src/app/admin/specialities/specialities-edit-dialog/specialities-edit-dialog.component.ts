// import { CommonModule } from '@angular/common';
// import { Component, Inject } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
// import { MatFormField, MatLabel } from '@angular/material/form-field';

// @Component({
//   selector: 'app-specialities-edit-dialog',
//   standalone: true,
//   imports: [MatDialogContent, MatDialogActions, FormsModule, MatLabel, MatFormField,CommonModule],
//   templateUrl: './specialities-edit-dialog.component.html',
//   styleUrls: ['./specialities-edit-dialog.component.css']
// })
// export class SpecialtiesEditDialogComponent {
//   localName: string;

//   constructor(
//     public dialogRef: MatDialogRef<SpecialtiesEditDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: { id: string; name: string }
//   ) {
//     // Initialize localName with the current name
//     this.localName = data.name || '';
//   }

//   get isNameInvalid(): boolean {
//     return !this.localName.trim(); // Check if the name is empty or only whitespace
//   }

//   onSave(): void {
//     if (!this.isNameInvalid) {
//       this.data.name = this.localName; // Update the original data object
//       this.dialogRef.close(this.data); // Close the dialog with the updated data
//     }
//   }

//   onCancel(): void {
//     this.dialogRef.close(); // Close the dialog without saving
//   }
// }


import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Import MatSnackBar

@Component({
  selector: 'app-specialities-edit-dialog',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, FormsModule, MatLabel, MatFormField, CommonModule, MatSnackBarModule], // Include MatSnackBarModule
  templateUrl: './specialities-edit-dialog.component.html',
  styleUrls: ['./specialities-edit-dialog.component.css']
})
export class SpecialtiesEditDialogComponent {
  localName: string;

  constructor(
    public dialogRef: MatDialogRef<SpecialtiesEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string; name: string },
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {
    this.localName = data.name || '';
  }

  get isNameInvalid(): boolean {
    return !this.localName.trim();
  }

  onSave(): void {
    if (!this.isNameInvalid) {
      this.data.name = this.localName; 
      this.dialogRef.close(this.data); 
      
      // Show Snackbar notification
      this.snackBar.open('Speciality edited successfully!', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}