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
import { Specialty } from '../../../model';
import { SpecialtyService } from '../../../services/speciality/specialty.service';

@Component({
    selector: 'app-specialties-delete-confirmation-dialog',
    standalone: true,
    imports: [MatDialogActions, MatButtonModule, MatDialogContent, MatSnackBarModule], // Include MatSnackBarModule
    templateUrl: './specialties-delete-confirmation-dialog.component.html',
    styleUrls: ['./specialties-delete-confirmation-dialog.component.css']
})
export class SpecialtiesDeleteConfirmationDialogComponent {
    loading = false;

    constructor(
        public dialogRef: MatDialogRef<SpecialtiesDeleteConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Specialty,
        private specialtyService: SpecialtyService,
        private snackBar: MatSnackBar
    ) {}

    onConfirm(): void {
        this.loading = true;
        this.specialtyService.deleteSpecialty(this.data._id).subscribe({
            next: () => {
                this.snackBar.open('Specialty deleted successfully!', 'Close', {
                    duration: 3000,
                    verticalPosition: 'top',
                    horizontalPosition: 'center',
                });
                this.dialogRef.close(true);
            },
            error: (error: any) => {
                console.error('Error deleting specialty:', error);
                this.snackBar.open('Error deleting specialty. Please try again.', 'Close', {
                    duration: 3000,
                    verticalPosition: 'top',
                    horizontalPosition: 'center',
                });
                this.loading = false;
            }
        });
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}