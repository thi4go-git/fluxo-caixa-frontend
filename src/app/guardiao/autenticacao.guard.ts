import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AutenticacaoService } from '../services/autenticacao.service';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AutenticacaoService);
  const router = inject(Router);
  const autenticado = authService.isAuthenticated();
  if (autenticado) {
    return true;
  } else {
    localStorage.clear();
    router.navigateByUrl('/login');
    return false;
  }
};