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
    document.body.classList.remove('sb-sidenav-toggled');
    this.authService.encerrarSessao();
    this.router.navigate(['/login']);
  }

  fecharMenuMobile(): void {
    if (window.innerWidth < 992) {
      document.body.classList.remove('sb-sidenav-toggled');
    }
  }

  navegarInicio() {
    this.router.navigate(['/graficos/dashboard-metabase']);
  }


}
