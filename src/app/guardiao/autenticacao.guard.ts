import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticacaoService } from '../services/autenticacao.service';


@Injectable({ providedIn: 'root' })
export class AutenticacaoGuard implements CanActivate {

  constructor(
    private authService: AutenticacaoService,
    private router: Router
  ) { }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    console.log("canActivate");

    const autenticado = this.authService.isAuthenticated();

    if (autenticado) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }


}
