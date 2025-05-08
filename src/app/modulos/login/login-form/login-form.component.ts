import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { LoadingService } from 'src/app/services/loading.service';
import { apiEnvironment } from 'src/environments/apiEnvironment';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {

  username: string;
  password: string;
  erros: string[];
  loginError: boolean;
  hide = true;
  usuarioLogado: string = "Deslogado";
  version = apiEnvironment.versao;

  constructor(
    private router: Router,
    private authService: AutenticacaoService,
    private loadingService: LoadingService,
    private snackBar: MatSnackBar
  ) {
    this.username = '';
    this.password = '';
    this.erros = [];
    this.loginError = false;
  }

  onSubmit() {
    if (this.username && this.password) {
      this.logar();
    } else {
      this.snackBar.open("Favor informar username e Senha!", "Info!", {
        duration: 2000
      });
    }
  }

  logar() {
    this.loadingService.show();
    this.authService
      .obterToken(this.username, this.password)
      .subscribe({
        next: (response) => {
          this.loadingService.hide();
          this.loginError = false;
          this.erros = [];
          const access_token = JSON.stringify(response);
          localStorage.setItem('access_token', access_token);
          this.router.navigate(['/graficos/dashboard'])
        },
        error: (errorResponse) => {
          this.loadingService.hide();
          const status = errorResponse.status;
          const msgErro = errorResponse.message;
          this.loginError = true;
          if (status == 0) {
            const infoErr = 'STATUS: (' + status + ") " + msgErro;
            this.erros = [infoErr];
          } else {
            this.erros = [errorResponse.error.error_description];
          }
        }
      });
  }

}
