import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDoctorModalComponent } from './add-doctor-modal.component';

describe('AddDoctorModalComponent', () => {
  let component: AddDoctorModalComponent;
  let fixture: ComponentFixture<AddDoctorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDoctorModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDoctorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
