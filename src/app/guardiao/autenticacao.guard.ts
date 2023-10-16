import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticacaoService } from '../services/autenticacao.service';


@Injectable({ providedIn: 'root' })
export class AutenticacaoGuard implements CanActivate {

  constructor(
    private authService: AutenticacaoService,
    private router: Router
  ) { }


  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const autenticado = this.authService.isAuthenticated();

    if (autenticado) {
      return true;
    } else {
      localStorage.clear();
      this.router.navigateByUrl('/login');// navigateByUrl recarrega a Pág.
      return false;
    }
  }


}
