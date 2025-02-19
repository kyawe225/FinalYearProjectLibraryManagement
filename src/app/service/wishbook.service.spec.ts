import { TestBed } from '@angular/core/testing';

import { WishbookService } from './wishbook.service';

describe('WishbookService', () => {
  let service: WishbookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WishbookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
