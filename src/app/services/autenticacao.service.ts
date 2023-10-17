import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { apiEnvironment } from 'src/environments/apiEnvironment';
import { Observable } from 'rxjs';



@Injectable({ providedIn: 'root' })
export class AutenticacaoService {


  urlToken: string = apiEnvironment.tokenUrl;
  cli_id = apiEnvironment.cli_id;
  cli_secret = apiEnvironment.cli_secret;

  jwtHelper: JwtHelperService;

  constructor(private http: HttpClient) {
    this.jwtHelper = new JwtHelperService();
  }


  obterToken(username: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('grant_type', 'password');
    const headers = {
      'Authorization': 'Basic ' + btoa(this.cli_id + ':' + this.cli_secret),
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    return this.http.post(this.urlToken, params.toString(), { headers });
  }

  isAuthenticated(): boolean {
    const token = this.obterTokenStorage();
    if (token) {
      const expirado = this.jwtHelper.isTokenExpired(token);
      return !expirado;
    }
    return false;
  }

  obterTokenStorage() {
    const tokenStr = localStorage.getItem('access_token');
    if (tokenStr) {
      const token = JSON.parse(tokenStr).access_token;
      return token;
    }
    return null;
  }

  encerrarSessao() {
    localStorage.removeItem('access_token');
  }

  getUsuarioAutenticado() {
    const token = this.obterTokenStorage();
    if (token) {
      const usuario = this.jwtHelper.decodeToken(token).preferred_username
      return usuario;
    }
  }

  getAuthoritiesToken() {
    const token = this.obterTokenStorage();
    if (token) {
      const authorities = this.jwtHelper.decodeToken(token).authorities;
      return authorities;
    }
  }

  isAdmin(authorities: string[]) {
    for (let cont = 0; cont < authorities.length; cont++) {
      let role = authorities[cont];
      if (role == "ROLE_ADMIN" || role == "ADMIN") {
        return true;
      }
    }
    return false;
  }

}
