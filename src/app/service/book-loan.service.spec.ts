import { TestBed } from '@angular/core/testing';

import { BookLoanService } from './book-loan.service';

describe('BookLoanService', () => {
  let service: BookLoanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookLoanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
