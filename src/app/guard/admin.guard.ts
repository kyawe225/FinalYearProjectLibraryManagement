import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const adminGuard: CanActivateChildFn = (childRoute, state) => {
  let authService = inject(AuthService);
  let router = inject(Router);
  let auth= authService.isAuthenticated.getValue();

  if(!auth){
    router.navigateByUrl("/auth/login");
  }
  return auth;
};
