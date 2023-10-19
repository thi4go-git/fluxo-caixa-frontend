import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Natureza } from 'src/app/model/natureza/natureza';
import { ParameterViolations } from 'src/app/model/parameterViolations';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { LancamentoService } from 'src/app/services/lancamento.service';

@Component({
  selector: 'app-natureza-form',
  templateUrl: './natureza-form.component.html',
  styleUrls: ['./natureza-form.component.css']
})
export class NaturezaFormComponent {


  natureza: Natureza = new Natureza();
  msgErros: ParameterViolations[] = [];
  listaErros: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<NaturezaFormComponent>,
    private auth: AutenticacaoService,
    private lancamentoService: LancamentoService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.natureza.username = auth.getUsuarioAutenticado();
  }

  onSubmit() {
    this.salvarNatureza();
  }

  fecharDialog() {
    this.dialogRef.close();
  }

  salvarNatureza() {
    this.lancamentoService.saveNatureza(this.natureza)
      .subscribe({
        next: (_resposta) => {
          this.msgErros = [];
          this.snackBar.open("Sucesso Ao Salvar Natureza!", "Info!", {
            duration: 5000
          });
          this.fecharDialog();
          this.router.navigateByUrl('naturezas/lista');
          window.location.reload();
        },
        error: (responseError) => {
          console.error(responseError);
          this.msgErros = responseError.error.erros
          this.snackBar.open("Erro Ao Salvar!", "Err!", {
            duration: 5000
          });
        }
      });
  }

}
