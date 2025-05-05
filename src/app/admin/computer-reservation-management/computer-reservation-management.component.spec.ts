import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputerReservationManagementComponent } from './computer-reservation-management.component';

describe('ComputerReservationManagementComponent', () => {
  let component: ComputerReservationManagementComponent;
  let fixture: ComponentFixture<ComputerReservationManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComputerReservationManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComputerReservationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
