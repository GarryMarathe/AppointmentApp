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
import { Specialty } from '../../../model';
import { SpecialtyService } from '../../../services/speciality/specialty.service';
import { finalize, map } from 'rxjs';

@Component({
  selector: 'app-specialities-edit-dialog',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, FormsModule, MatLabel, MatFormField, CommonModule, MatSnackBarModule], // Include MatSnackBarModule
  templateUrl: './specialities-edit-dialog.component.html',
  styleUrls: ['./specialities-edit-dialog.component.css']
})
export class SpecialtiesEditDialogComponent {
  localName: string;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<SpecialtiesEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Specialty,
    private specialtyService: SpecialtyService,
    private snackBar: MatSnackBar
  ) {
    console.log('Edit dialog data:', data); // Debug log
    this.localName = data.name || '';
  }

  get isNameInvalid(): boolean {
    return !this.localName || !this.localName.trim();
  }

  // onSave(): void {
  //   if (this.isNameInvalid) {
  //     this.snackBar.open('Please enter a valid name', 'Close', {
  //       duration: 2000
  //     });
  //     return;
  //   }

  //   this.loading = true;
  //   const updatedSpecialty: Specialty = {
  //     ...this.data,
  //     name: this.localName.trim()
  //   };

  //   this.specialtyService.updateSpecialty(updatedSpecialty).subscribe({
  //     next: (response) => {
  //       console.log('Update response:', response);
  //       this.snackBar.open('Specialty updated successfully!', 'Close', {
  //         duration: 3000,
  //         verticalPosition: 'top',
  //         horizontalPosition: 'center',
  //       });
  //       this.dialogRef.close(response);
  //     },
  //     error: (error) => {
  //       console.error('Update error:', error);
  //       this.snackBar.open('Error updating specialty. Please try again.', 'Close', {
  //         duration: 3000,
  //       });
  //       this.loading = false;
  //     },
  //     complete: () => {
  //       this.loading = false;
  //     }
  //   });
  // }


  onSave(): void {
    if (this.isNameInvalid) {
      this.snackBar.open('Please enter a valid name', 'Close', {
        duration: 2000
      });
      return;
    }

    const trimmedName = this.localName.trim();
    this.loading = true;

    // Check for existing name using getAllSpecialties
    this.specialtyService.getAllSpecialties()
      .pipe(
        map((response: any) => {
          const specialties = response.specialities;
          return specialties.some((specialty: Specialty) => 
            specialty.name.toLowerCase() === trimmedName.toLowerCase() && 
            specialty._id !== this.data._id // Exclude current specialty
          );
        }),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (exists) => {
          if (exists) {
            this.snackBar.open('A specialty with this name already exists', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
            horizontalPosition: 'center',
            });
            return;
          }
          this.updateSpecialty(trimmedName);
        },
        error: (error) => {
          console.error('Error checking specialty name:', error);
          this.snackBar.open(error, 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
        }
      });
  }

  private updateSpecialty(name: string): void {
    const updatedSpecialty: Specialty = {
      ...this.data,
      name: name
    };

    this.loading = true;
    this.specialtyService.updateSpecialty(updatedSpecialty)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          console.log('Update response:', response);
          this.snackBar.open('Specialty updated successfully!', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Update error:', error);
          this.snackBar.open(error, 'Close', {
            duration: 3000,
          });
        }
      });
  }


  onCancel(): void {
    this.dialogRef.close();
  }
}