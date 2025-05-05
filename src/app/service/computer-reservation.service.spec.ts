import { TestBed } from '@angular/core/testing';

import { ComputerReservationService } from './computer-reservation.service';

describe('ComputerReservationService', () => {
  let service: ComputerReservationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComputerReservationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
