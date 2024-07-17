import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserDataService } from './user-data.service';

export const routeGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const isPremium = inject(UserDataService).isPremiumUser

  return isPremium || router.navigate(['unauthorized']);
};
