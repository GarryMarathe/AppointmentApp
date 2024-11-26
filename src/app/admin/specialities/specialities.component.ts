import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SpecialtiesDeleteConfirmationDialogComponent } from './specialties-delete-confirmation-dialog/specialties-delete-confirmation-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { SpecialtiesEditDialogComponent } from './specialities-edit-dialog/specialities-edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { SpecialtiesAddDialogComponent } from './specialties-add-dialog/specialties-add-dialog.component';
import { SpecialtyService } from '../../services/speciality/specialty.service';
import { Specialty } from '../../model';

@Component({
  selector: 'app-specialities',
  standalone: true,
  imports: [
    SpecialtiesEditDialogComponent,
    SpecialtiesDeleteConfirmationDialogComponent,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    FormsModule,
    MatIcon,
  ],
  templateUrl: './specialities.component.html',
  styleUrls: ['./specialities.component.css'],
})
export class SpecialtiesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<Specialty>([]);
  pageSize = 5; // Define the pageSize property

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  loading: boolean | undefined;
  snackBar: any;

  constructor(private dialog: MatDialog, private specialtyService: SpecialtyService) {}

  ngOnInit(): void {
    this.loadSpecialties();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort; // Bind MatSort to the dataSource
  }

  // loadSpecialties() {
  //   this.specialtyService.getAllSpecialties().subscribe(
  //     (data) => {
  //       this.dataSource.data = data.specialities;
  //       // console.log(data)
  //     },
  //     (error) => {
  //       console.error('Error fetching specialties:', error);
  //     }
  //   );
  // }
  loadSpecialties() {
    this.loading = true;
    this.specialtyService.getAllSpecialties().subscribe({
        next: (data) => {
            console.log('Loaded specialties:', data);
            this.dataSource.data = data.specialities;
        },
        error: (error) => {
            console.error('Error fetching specialties:', error);
            this.snackBar.open('Error loading specialties', 'Close', {
                duration: 3000,
            });
        },
        complete: () => {
            this.loading = false;
        }
    });
}

openEditDialog(specialty: Specialty) {
  console.log('Opening edit dialog for specialty:', specialty); // Debug log
  
  const dialogRef = this.dialog.open(SpecialtiesEditDialogComponent, {
    width: '400px',
    data: specialty,
    disableClose: true
  });

  dialogRef.afterClosed().subscribe((result: Specialty) => {
    console.log('Dialog result:', result); // Debug log
    if (result) {
      this.loadSpecialties(); // Reload the list after successful update
    }
  });
}

  // openEditDialog(specialty: Specialty) {
  //   const dialogRef = this.dialog.open(SpecialtiesEditDialogComponent, {
  //     data: specialty,
  //   });

  //   dialogRef.afterClosed().subscribe((result: Specialty) => {
  //     if (result) {
  //       this.updateSpecialty(result);
  //     }
  //   });
  // }

  // updateSpecialty(specialty: Specialty) {
  //   this.specialtyService.updateSpecialty(specialty).subscribe(
  //     (updatedSpecialty) => {
  //       this.loadSpecialties(); // Reload specialties after update
  //     },
  //     (error) => {
  //       console.error('Error updating specialty:', error);
  //     }
  //   );
  // }

  openDeleteConfirmationDialog(specialty: Specialty) {
    const dialogRef = this.dialog.open(SpecialtiesDeleteConfirmationDialogComponent, {
        width: '400px',
        data: specialty,
        disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
            this.loadSpecialties(); // Reload the list after successful deletion
        }
    });
}
  // openDeleteConfirmationDialog(specialty: Specialty) {
  //   const dialogRef = this.dialog.open(SpecialtiesDeleteConfirmationDialogComponent, {
  //     data: specialty,
  //   });

  //   dialogRef.afterClosed().subscribe((result: any) => {
  //     if (result) {
  //       this.deleteSpecialty(specialty._id);
  //     }
  //   });
  // }

  // deleteSpecialty(id: string) {
  //   this.specialtyService.deleteSpecialty(id).subscribe(
  //     () => {
  //       this.loadSpecialties(); // Reload specialties after delete
  //     },
  //     (error) => {
  //       console.error('Error deleting specialty:', error);
  //     }
  //   );
  // }

  // openAddDialog() {
  //   const dialogRef = this.dialog.open(SpecialtiesAddDialogComponent, {
  //     width: '250px',
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.loadSpecialties();
  //     }
  //   });
  // }
  openAddDialog() {
    const dialogRef = this.dialog.open(SpecialtiesAddDialogComponent, {
        width: '400px', // Made it a bit wider
        disableClose: true // Prevent closing by clicking outside
    });

    dialogRef.afterClosed().subscribe((result) => {
        console.log('Dialog result:', result);
        if (result) {
            this.loadSpecialties(); // Reload the list after successful addition
        }
    });
}

  // addSpecialty(name: string) {
  //   this.specialtyService.addSpecialty(name).subscribe(
  //     (data) => {
  //       console.log(data)
  //       // this.dataSource.data.push(newSpecialty); // Add the new specialty to the data source
  //       // this.loadSpecialties();  // Reload specialties after add
  //       // this.dataSource._updateChangeSubscription(); // Update the data source
  //     },
  //     (error) => {
  //       console.error('Error adding specialty:', error);
  //     }
  //   );
  // }

  onPageChange(event: PageEvent) {
    // Handle page change event if necessary
    console.log('Page changed:', event);
  }
}
