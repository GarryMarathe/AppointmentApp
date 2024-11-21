import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort'; // Import Sort here
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SpecialtiesDeleteConfirmationDialogComponent } from './specialties-delete-confirmation-dialog/specialties-delete-confirmation-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { SpecialtiesEditDialogComponent } from './specialities-edit-dialog/specialities-edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { SpecialtiesAddDialogComponent } from './specialties-add-dialog/specialties-add-dialog.component';

export interface Specialty {
  id: string;
  name: string;
}

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
  currentPage = 0;
  pageSize = 5;

  private static specialties: Specialty[] = [
    { id: '1', name: 'Cardiology' },
    { id: '2', name: 'Neurology' },
    { id: '3', name: 'Pediatrics' },
    { id: '4', name: 'Orthopedic' },
    { id: '5', name: 'Gynecology' },
    { id: '6', name: 'Urology' },
    { id: '7', name: 'Dentist' },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.paginator) {
      this.paginator.pageSize = this.pageSize;
    }
  }

  ngOnInit(): void {
    this.loadSpecialties();
  }

  loadSpecialties() {
    this.dataSource.data = SpecialtiesComponent.specialties;
  }

  // Custom sorting function
  customSort(data: Specialty[], sort: Sort) {
    const direction = sort.direction === 'asc' ? 1 : -1;
    return data.sort((a, b) => {
      return a.name.localeCompare(b.name) * direction;
    });
  }

  openEditDialog(specialty: Specialty) {
    const dialogRef = this.dialog.open(SpecialtiesEditDialogComponent, {
      data: specialty,
    });

    dialogRef.afterClosed().subscribe((result: Specialty) => {
      if (result) {
        const index = this.dataSource.data.findIndex((s) => s.id === specialty.id);
        if (index !== -1) {
          this.dataSource.data[index] = result;
          this.dataSource._updateChangeSubscription();
        }
      }
    });
  }

  openDeleteConfirmationDialog(specialty: Specialty) {
    const dialogRef = this.dialog.open(SpecialtiesDeleteConfirmationDialogComponent, {
      data: specialty,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter((s) => s.id !== specialty.id);
        this.dataSource.data.forEach((s, index) => {
          s.id = (index + 1).toString();
        });
        this.dataSource._updateChangeSubscription();
      }
    });
  }
  openAddDialog() {
    const dialogRef = this.dialog.open(SpecialtiesAddDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result: Specialty) => {
      if (result) {
        result.id = (this.dataSource.data.length + 1).toString(); // Set new ID
        this.dataSource.data.push(result);
        this.dataSource._updateChangeSubscription();
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
  }

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }
    this.dataSource.data = this.customSort(data, sort);
  }
}