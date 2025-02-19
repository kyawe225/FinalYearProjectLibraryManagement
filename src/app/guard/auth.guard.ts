import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  let authService = inject(AuthService);
  let router = inject(Router);
  let auth= authService.isAuthenticated.getValue();

  if(auth){
    router.navigateByUrl("/admin/book/list");
  }
  return !auth;
};
