import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserDataService } from '../userData/user-data.service';

export const routeGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const userDataService = inject(UserDataService)

  if (!userDataService.userData) {
    return router.navigate(['unauthorized/401'])
  } else if (route.data['isPremium'] == true) {
    const id = route.paramMap.get('id')
    if (id) {
      if (userDataService.currentPremiumTierlistIDs?.includes(Number(id))) {
        return userDataService.isPremiumUser || router.navigate(['unauthorized/403'])
      }
    }
    return true
  } else {
    return true
  }
};
