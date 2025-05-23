import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LancamentoService } from 'src/app/services/lancamento.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParameterViolations } from 'src/app/model/parameterViolations';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { AvisosDialogService } from 'src/app/services/avisos-dialog.service';
import { NaturezaNewDTO } from 'src/app/model/natureza/naturezaNewDTO';
import { LancamentoNewDTO } from 'src/app/model/lancamento/lancamentoNewDTO';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';




@Component({
  selector: 'app-lancamento-form',
  templateUrl: './lancamento-form.component.html',
  styleUrls: ['./lancamento-form.component.css']
})
export class LancamentoFormComponent implements OnInit {


  hide = true;
  natureza: NaturezaNewDTO[] = [];
  situacao: any[] = [];

  tipo_doc: any[] = [];
  origemEnum: any[] = [];

  lancamento!: LancamentoNewDTO;
  data_referencia!: Date;

  msgErros: ParameterViolations[] = [];

  constructor(
    public dialogRef: MatDialogRef<LancamentoFormComponent>,
    private service: LancamentoService,
    private snackBar: MatSnackBar,
    private auth: AutenticacaoService,
    private avisoDialogService: AvisosDialogService,
    private loadingService: LoadingService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.processoInicial();
  }

  processoInicial() {

    this.lancamento = new LancamentoNewDTO();
    this.lancamento.username = this.auth.getUsuarioAutenticado();

    this.definirTipo();
    this.definirNatureza();
    this.definirSituacao();
    this.definirOrigem();

  }

  definirNatureza() {
    this.loadingService.show();
    this.service.getNaturezasByUsername()
      .subscribe({
        next: (resposta) => {
          this.loadingService.hide();
          if (resposta == null) {
            this.snackBar.open("Não existem Naturezas, favor cadastrar", "Info!", {
              duration: 5000
            });
          } else {
            this.natureza = resposta;
          }
        },
        error: (errorDefinirNatureza) => {
          this.loadingService.hide();
          console.error(errorDefinirNatureza);
          this.snackBar.open("Erro ao definir naturezas: ", errorDefinirNatureza, {
            duration: 4000
          });
        }
      });
  }

  definirSituacao() {
    this.loadingService.show();
    this.service.findAllSituacao()
      .subscribe({
        next: (resposta) => {
          this.loadingService.hide();
          this.situacao = resposta;
        },
        error: (erroDefinirSituacao) => {
          this.loadingService.hide();
          console.error(erroDefinirSituacao);
          this.snackBar.open("Erro: ", erroDefinirSituacao, {
            duration: 5000
          });
        }
      });
  }


  definirTipo() {
    this.loadingService.show();
    this.service.findAllTipo()
      .subscribe({
        next: (resposta) => {
          this.loadingService.hide();
          this.tipo_doc = resposta;
        },
        error: (erroDefinirTipo) => {
          this.loadingService.hide();
          console.error(erroDefinirTipo);
          this.snackBar.open("Erro ao definir tipo lançamento: ", erroDefinirTipo, {
            duration: 5000
          });
        }
      });
  }

  definirOrigem() {
    this.loadingService.show();
    this.service.findAllOrigem()
      .subscribe({
        next: (resposta) => {
          this.loadingService.hide();
          this.origemEnum = resposta;
        },
        error: (erroDefinirOrigem) => {
          this.loadingService.hide();
          console.error(erroDefinirOrigem);
          this.snackBar.open("Erro ao definir Origem lançamento: ", erroDefinirOrigem, {
            duration: 5000
          });
        }
      });
  }

  fecharDialog() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.validarLancamento()) {

      let msgObsSalvar = 'Confirmar Operação?';

      if (this.lancamento.tipo == 'AMBOS') {
        msgObsSalvar = "Atenção: O tipo de lançamento escolhido foi 'AMBOS' essa ação criará os 2 tipos de lançamento: Débito e Crédito, Confirma?";
      }

      this.avisoDialogService.openConfirmationDialog(msgObsSalvar)
        .then(result => {
          if (result) {
            this.salvar();
          } else {
            this.snackBar.open("Processo cancelado!", "Cancelado!", {
              duration: 3000
            });
          }
        });
    }
  }

  validarLancamento(): boolean {

    if (this.lancamento.tipo == undefined) {
      this.snackBar.open("Informe um tipo para o Lançamento!", "Info:", {
        duration: 4000
      });
    } else {
      if (this.lancamento.idNatureza == undefined) {
        this.snackBar.open("Informe uma natureza para o Lançamento!", "Info:", {
          duration: 4000
        });
      } else {
        if (this.lancamento.descricao == '' || this.lancamento.descricao == undefined) {
          this.snackBar.open("Informe uma descrição para o Lançamento!", "Info:", {
            duration: 4000
          });
        } else {
          if (!this.lancamento.dataReferencia) {
            this.snackBar.open("Informe a data de referência para o Lançamento!", "Info:", {
              duration: 4000
            });
          } else {
            if (this.lancamento.valorTotal == undefined || this.lancamento.valorTotal <= 0) {
              this.snackBar.open("Informe o valor total do Lançamento!", "Info:", {
                duration: 4000
              });
            } else {
              if (this.lancamento.qtdeParcelas == undefined || this.lancamento.qtdeParcelas <= 0) {
                this.snackBar.open("Informe a qtde de parcelas!", "Info:", {
                  duration: 4000
                });
              } else {
                return true;
              }
            }
          }
        }
      }
    }

    return false;
  }

  salvar() {
    this.loadingService.show();
    this.service.save(this.lancamento)
      .subscribe({
        next: (_resposta) => {
          this.loadingService.hide();
          this.snackBar.open("Sucesso ao salvar!", "Info!", {
            duration: 4000
          });
          this.fecharDialog();
          location.reload();
        },
        error: (erroSalvar) => {
          this.loadingService.hide();
          this.msgErros = erroSalvar.error.parameterViolations;
        }
      });

  }

}
