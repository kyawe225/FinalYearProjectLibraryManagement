import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupnotificationComponent } from './pickupnotification.component';

describe('PickupnotificationComponentComponent', () => {
  let component: PickupnotificationComponent;
  let fixture: ComponentFixture<PickupnotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickupnotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickupnotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
