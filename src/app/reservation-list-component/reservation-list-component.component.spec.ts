import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationListComponentComponent } from './reservation-list-component.component';

describe('ReservationListComponentComponent', () => {
  let component: ReservationListComponentComponent;
  let fixture: ComponentFixture<ReservationListComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationListComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
