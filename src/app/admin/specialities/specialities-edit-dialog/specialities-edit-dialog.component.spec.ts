import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialtiesEditDialogComponent } from './specialities-edit-dialog.component';

describe('SpecialitiesEditDialogComponent', () => {
  let component: SpecialtiesEditDialogComponent;
  let fixture: ComponentFixture<SpecialtiesEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialtiesEditDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialtiesEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
