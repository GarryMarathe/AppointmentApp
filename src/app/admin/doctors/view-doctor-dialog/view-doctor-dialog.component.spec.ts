import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDoctorDialogComponent } from './view-doctor-dialog.component';

describe('ViewDoctorDialogComponent', () => {
  let component: ViewDoctorDialogComponent;
  let fixture: ComponentFixture<ViewDoctorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDoctorDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDoctorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
