import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialtiesAddDialogComponent } from './specialties-add-dialog.component';

describe('SpecialtiesAddDialogComponent', () => {
  let component: SpecialtiesAddDialogComponent;
  let fixture: ComponentFixture<SpecialtiesAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialtiesAddDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialtiesAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
