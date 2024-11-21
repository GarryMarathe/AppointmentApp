import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorDeleteDialogComponent } from './doctor-delete-dialog.component';

describe('DoctorDeleteDialogComponent', () => {
  let component: DoctorDeleteDialogComponent;
  let fixture: ComponentFixture<DoctorDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorDeleteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
