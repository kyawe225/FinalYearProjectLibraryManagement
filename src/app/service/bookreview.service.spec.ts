import { TestBed } from '@angular/core/testing';

import { BookreviewService } from './bookreview.service';

describe('BookreviewService', () => {
  let service: BookreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookreviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
