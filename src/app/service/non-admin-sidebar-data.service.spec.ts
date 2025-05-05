import { TestBed } from '@angular/core/testing';

import { NonAdminSidebarDataService } from './non-admin-sidebar-data.service';

describe('NonAdminSidebarDataService', () => {
  let service: NonAdminSidebarDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NonAdminSidebarDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
