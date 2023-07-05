import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { apiEnvironment } from 'src/environments/apiEnvironment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {



  usuarioLogado: string = "Deslogado";
  versao: string = '';

  constructor(
    private authService: AutenticacaoService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.usuarioLogado = this.authService.getUsuarioAutenticado();
    this.versao = apiEnvironment.versao;
  }

  logout() {
    this.authService.encerrarSessao();
    this.router.navigate(['/login']);
  }


  navegarInicio() {
    this.router.navigate(['/graficos/dashboard']);
  }


}
