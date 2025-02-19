import { TestBed } from '@angular/core/testing';
import { CanActivateChildFn } from '@angular/router';

import { nonAdminGuard } from './non-admin.guard';

describe('nonAdminGuard', () => {
  const executeGuard: CanActivateChildFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => nonAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
