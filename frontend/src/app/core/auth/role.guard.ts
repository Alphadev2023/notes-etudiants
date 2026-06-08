import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles: string[] = route.data['roles'] ?? [];

  if (!authService.isAuthenticated()) {
    setTimeout(() => router.navigateByUrl('/auth/login'), 100);
    return false;
  }

  const hasRole = requiredRoles.some((role) => authService.hasRole(role));
  if (!hasRole) {
    setTimeout(() => router.navigateByUrl('/not-found'), 100);
    return false;
  }

  return true;
};
