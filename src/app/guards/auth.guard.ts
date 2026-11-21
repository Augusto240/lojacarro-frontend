import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (rota, estado) => {
  if (inject(AuthService).logado()) {
    return true;
  }
  return inject(Router).createUrlTree(['/login'], { queryParams: { voltar: estado.url } });
};
