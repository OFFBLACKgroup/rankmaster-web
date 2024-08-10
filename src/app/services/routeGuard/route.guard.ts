import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserManagerService } from '../userManager/user-manager.service';

export const routeGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const userManager = inject(UserManagerService)

  if (userManager.userData == undefined) {
    return router.navigate(['unauthorized/401'])
  } else if (route.data['isPremium'] == true) {
    const id = route.paramMap.get('id')
    if (id) {
      if (userManager.currentPremiumTierlistIDs?.includes(Number(id))) {
        return userManager.isPremiumUser || router.navigate(['unauthorized/403'])
      }
    }
    return true
  } else {
    return true
  }
};
