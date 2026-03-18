import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiEnvironment } from 'src/environments/apiEnvironment';
import { UsuarioDTO } from '../model/usuario/usuarioDTO';
import { Observable } from 'rxjs';



@Injectable({providedIn: 'root'})
export class UsuarioService {

  private apiUrl: string = apiEnvironment.apiUrl;

  constructor(
    private http: HttpClient
  ) {
  }

  findByTokenJwt(): Observable<UsuarioDTO> {
    return this.http.get<UsuarioDTO>(this.apiUrl + '/usuarios/info');
  }
}
