import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Natureza } from 'src/app/entity-class/natureza';
import { ParameterViolations } from 'src/app/entity-class/parameterViolations';
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

  constructor(
    public dialogRef: MatDialogRef<NaturezaFormComponent>,
    private auth: AutenticacaoService,
    private lancamentoService: LancamentoService,
    private snackBar: MatSnackBar
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
        next: (resposta) => {
          this.msgErros = [];
          this.snackBar.open("Sucesso Ao Salvar!", "Info!", {
            duration: 5000
          });
        },
        error: (responseError) => {
          console.log("Erro");
          console.log(responseError);
          this.msgErros = responseError.error.parameterViolations;
          this.snackBar.open("Erro Ao Salvar!", "Err!", {
            duration: 5000
          });
        }
      });
  }

}
