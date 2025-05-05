import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentFulfillmentComponent } from './appointment-fulfillment.component';

describe('AppointmentFulfillmentComponent', () => {
  let component: AppointmentFulfillmentComponent;
  let fixture: ComponentFixture<AppointmentFulfillmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentFulfillmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentFulfillmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
