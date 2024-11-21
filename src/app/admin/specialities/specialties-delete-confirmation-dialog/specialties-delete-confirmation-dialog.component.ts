// import { Component, Inject } from '@angular/core';
// import { MatButtonModule } from '@angular/material/button';
// import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';


// @Component({
//   selector: 'app-specialties-delete-confirmation-dialog',
//   standalone: true,
//   imports: [MatDialogActions,MatButtonModule,MatDialogContent],
//   templateUrl: './specialties-delete-confirmation-dialog.component.html',
//   styleUrl: './specialties-delete-confirmation-dialog.component.css'
// })
// export class SpecialtiesDeleteConfirmationDialogComponent {
//   constructor(
//     public dialogRef: MatDialogRef<SpecialtiesDeleteConfirmationDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: { id: string; name: string }
//   ) {}

//   onConfirm(): void {
//     this.dialogRef.close(true);
//   }

//   onCancel(): void {
//     this.dialogRef.close(false);
//   }
// }


import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Import MatSnackBar

@Component({
    selector: 'app-specialties-delete-confirmation-dialog',
    standalone: true,
    imports: [MatDialogActions, MatButtonModule, MatDialogContent, MatSnackBarModule], // Include MatSnackBarModule
    templateUrl: './specialties-delete-confirmation-dialog.component.html',
    styleUrls: ['./specialties-delete-confirmation-dialog.component.css']
})
export class SpecialtiesDeleteConfirmationDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<SpecialtiesDeleteConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { id: string; name: string },
        private snackBar: MatSnackBar // Inject MatSnackBar
    ) {}

    onConfirm(): void {
        this.dialogRef.close(true); // Close the dialog and confirm deletion
        
        // Show Snackbar notification
        this.snackBar.open('Speciality deleted successfully!', 'Close', {
            duration: 3000, // Duration in milliseconds
            verticalPosition: 'top', // Positioning of the Snackbar
            horizontalPosition: 'center', // Positioning of the Snackbar
        });
    }

    onCancel(): void {
        this.dialogRef.close(false); // Close the dialog without confirming deletion
    }
}