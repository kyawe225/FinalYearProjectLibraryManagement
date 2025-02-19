import { CanActivateChildFn } from '@angular/router';

export const nonAdminGuard: CanActivateChildFn = (childRoute, state) => {
  return true;
};
