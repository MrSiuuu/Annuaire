import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = (route: any) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const requiredType = route.data['requiredType'];
  if (requiredType && authService.getUserType() !== requiredType) {
    router.navigate(['/']);
    return false;
  }

  return true;
}; 