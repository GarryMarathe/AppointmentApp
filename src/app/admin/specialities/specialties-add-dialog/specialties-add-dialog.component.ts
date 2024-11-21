// import { Component, Inject } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
// import { Specialty } from '../specialities.component';
// import { FormsModule } from '@angular/forms';
// import { MatFormField, MatLabel } from '@angular/material/form-field';
// import { CommonModule } from '@angular/common';

// @Component({
//     selector: 'app-specialties-add-dialog',
//     standalone: true,
//     imports: [MatDialogActions, FormsModule, MatLabel, MatFormField, MatDialogContent,CommonModule],
//     templateUrl: './specialties-add-dialog.component.html',
//     styleUrls: ['./specialties-add-dialog.component.css']
// })
// export class SpecialtiesAddDialogComponent {
//     specialty: Specialty = { id: '', name: '' };

//     constructor(
//         public dialogRef: MatDialogRef<SpecialtiesAddDialogComponent>,
//         @Inject(MAT_DIALOG_DATA) public data: Specialty
//     ) {}

//     get isNameEmpty(): boolean {
//         return !this.specialty.name || this.specialty.name.trim() === '';
//     }

//     onNoClick(): void {
//         this.dialogRef.close();
//     }

//     onAddClick(): void {
//         if (this.isNameEmpty) {
//             // Optionally, you can show an alert or some other UI feedback
//             return;
//         }
//         this.dialogRef.close(this.specialty);
//     }
// }

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { Specialty } from '../specialities.component';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Import MatSnackBar

@Component({
    selector: 'app-specialties-add-dialog',
    standalone: true,
    imports: [MatDialogActions, FormsModule, MatLabel, MatFormField, MatDialogContent, CommonModule, MatSnackBarModule], // Include MatSnackBarModule
    templateUrl: './specialties-add-dialog.component.html',
    styleUrls: ['./specialties-add-dialog.component.css']
})
export class SpecialtiesAddDialogComponent {
    specialty: Specialty = { id: '', name: '' };

    constructor(
        public dialogRef: MatDialogRef<SpecialtiesAddDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Specialty,
        private snackBar: MatSnackBar // Inject MatSnackBar
    ) {}

    get isNameEmpty(): boolean {
        return !this.specialty.name || this.specialty.name.trim() === '';
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onAddClick(): void {
        if (this.isNameEmpty) {
            // Optionally, you can show an alert or some other UI feedback
            return;
        }
        this.dialogRef.close(this.specialty); // Close the dialog with the new specialty
        
        // Show Snackbar notification
        this.snackBar.open('Speciality added successfully!', 'Close', {
            duration: 3000, // Duration in milliseconds
            verticalPosition: 'top', // Positioning of the Snackbar
            horizontalPosition: 'center', // Positioning of the Snackbar
        });
    }
}