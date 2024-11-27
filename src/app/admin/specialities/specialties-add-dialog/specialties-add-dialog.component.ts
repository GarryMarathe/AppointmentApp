import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar
import { SpecialtyService } from '../../../services/speciality/specialty.service';
import { Specialty } from '../../../model';
import { finalize, map } from 'rxjs';


@Component({
    selector: 'app-specialties-add-dialog',
    standalone: true,
    imports: [FormsModule, MatLabel, MatFormField, CommonModule], // Removed MatSnackBarModule from imports
    templateUrl: './specialties-add-dialog.component.html',
    styleUrls: ['./specialties-add-dialog.component.css']
})
export class SpecialtiesAddDialogComponent {
    name: string = '';
    loading: boolean = false; // Add loading state

    constructor(
        public dialogRef: MatDialogRef<SpecialtiesAddDialogComponent>,
        private specialtyService: SpecialtyService,
        private snackBar: MatSnackBar
    ) {}
  
    get isNameEmpty(): boolean {
        return !this.name || this.name.trim() === '';
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    // onAdd(): void {
    //     if (this.isNameEmpty) {
    //         this.snackBar.open('Please enter a specialty name', 'Close', {
    //             duration: 2000,
    //         });
    //         return;
    //     }

    //     this.loading = true;
    //     this.specialtyService.addSpecialty(this.name.trim()).subscribe({
    //         next: (response) => {
    //             console.log('Add specialty response:', response);
    //             this.snackBar.open('Specialty added successfully!', 'Close', {
    //                 duration: 2000,
    //             });
    //             this.dialogRef.close(response); // Pass back the response
    //         },
    //         error: (error) => {
    //             console.error('Error adding specialty:', error);
    //             this.snackBar.open(error.message || 'Error adding specialty. Please try again.', 'Close', {
    //                 duration: 3000,
    //             });
    //         },
    //         complete: () => {
    //             this.loading = false;
    //         }
    //     });
    // }
    onAdd(): void {
        if (this.isNameEmpty) {
          this.snackBar.open('Please enter a specialty name', 'Close', {
            duration: 2000,
          });
          return;
        }
    
        const trimmedName = this.name.trim();
        this.loading = true;
    
        // Check for existing name using getAllSpecialties
        this.specialtyService.getAllSpecialties()
          .pipe(
            map((response: any) => {
              const specialties = response.specialities;
              return specialties.some((specialty: Specialty) => 
                specialty.name.toLowerCase() === trimmedName.toLowerCase()
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
              this.addSpecialty(trimmedName);
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
    
      private addSpecialty(name: string): void {
        this.loading = true;
        this.specialtyService.addSpecialty(name)
          .pipe(finalize(() => this.loading = false))
          .subscribe({
            next: (response) => {
              console.log('Add specialty response:', response);
              this.snackBar.open('Specialty added successfully!', 'Close', {
                duration: 2000,
              });
              this.dialogRef.close(response);
            },
            error: (error) => {
              console.error('Error adding specialty:', error);
              this.snackBar.open(error.message || 'Error adding specialty. Please try again.', 'Close', {
                duration: 3000,
              });
            }
          });
      }
}