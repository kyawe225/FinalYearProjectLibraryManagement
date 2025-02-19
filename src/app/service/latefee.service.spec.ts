import { TestBed } from '@angular/core/testing';

import { LatefeeService } from './latefee.service';

describe('LatefeeService', () => {
  let service: LatefeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LatefeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
