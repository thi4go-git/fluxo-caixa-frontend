import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LancamentoDTO } from 'src/app/entity-class/lancamentoDTO';
import { LancamentoService } from 'src/app/services/lancamento.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParameterViolations } from 'src/app/entity-class/parameterViolations';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { NaturezaDTO } from 'src/app/entity-class/naturezaDTO';




@Component({
  selector: 'app-lancamento-form',
  templateUrl: './lancamento-form.component.html',
  styleUrls: ['./lancamento-form.component.css']
})
export class LancamentoFormComponent implements OnInit {


  hide = true;
  natureza: NaturezaDTO[] = [];
  situacao: any[] = [];

  tipo_doc: any[] = [];

  lancamento!: LancamentoDTO;
  data_referencia!: Date;

  msgErros: ParameterViolations[] = [];

  constructor(
    public dialogRef: MatDialogRef<LancamentoFormComponent>,
    private service: LancamentoService,
    private snackBar: MatSnackBar,
    private auth: AutenticacaoService
  ) {
    this.lancamento = new LancamentoDTO();
    this.lancamento.username = auth.getUsuarioAutenticado();
  }


  ngOnInit(): void {
    this.definirNatureza();
    this.definirSituacao();
    this.definirTipo();
  }

  definirNatureza() {
    this.service.getNaturezasByUsername()
      .subscribe({
        next: (resposta) => {
          console.log(resposta);
          if (resposta == null) {
            this.snackBar.open("Não existem Naturezas, favor cadastrar", "Info!", {
              duration: 5000
            });
          } else {
            this.natureza = resposta;
          }
        },
        error: (responseError) => {
          console.log("Erro");
          console.log(responseError);
        }
      });
  }

  definirSituacao() {
    this.service.findAllSituacao()
      .subscribe({
        next: (resposta) => {
          this.situacao = resposta;
        },
        error: (responseError) => {
          console.log("Erro");
          console.log(responseError);
        }
      });
  }


  definirTipo() {
    this.service.findAllTipo()
      .subscribe({
        next: (resposta) => {
          this.tipo_doc = resposta;
        },
        error: (responseError) => {
          console.log("Erro");
          console.log(responseError);
        }
      });
  }

  fecharDialog() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.salvar();
  }

  salvar() {
    this.service.save(this.lancamento)
      .subscribe({
        next: (resposta) => {
          this.snackBar.open("Sucesso ao salvar!", "Info!", {
            duration: 2000
          });
        },
        error: (responseError) => {
          this.msgErros = responseError.error.parameterViolations;
        }
      });

  }

}
