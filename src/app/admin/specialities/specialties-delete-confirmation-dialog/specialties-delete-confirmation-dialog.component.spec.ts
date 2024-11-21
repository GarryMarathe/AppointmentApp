import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialtiesDeleteConfirmationDialogComponent } from './specialties-delete-confirmation-dialog.component';

describe('SpecialtiesDeleteConfirmationDialogComponent', () => {
  let component: SpecialtiesDeleteConfirmationDialogComponent;
  let fixture: ComponentFixture<SpecialtiesDeleteConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialtiesDeleteConfirmationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialtiesDeleteConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
