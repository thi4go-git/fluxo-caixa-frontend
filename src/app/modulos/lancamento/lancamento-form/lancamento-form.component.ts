import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LancamentoDTO } from 'src/app/entity-class/lancamentoDTO';
import { LancamentoService } from 'src/app/services/lancamento.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParameterViolations } from 'src/app/entity-class/parameterViolations';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { NaturezaDTO } from 'src/app/entity-class/naturezaDTO';
import { AvisosDialogService } from 'src/app/services/avisos-dialog.service';




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
    private auth: AutenticacaoService,
    private avisoDialogService: AvisosDialogService
  ) { }


  ngOnInit(): void {
    this.processoInicial();
  }

  processoInicial() {

    this.lancamento = new LancamentoDTO();
    this.lancamento.username = this.auth.getUsuarioAutenticado();

    this.definirTipo();
    this.definirNatureza();
    this.definirSituacao();

  }

  definirNatureza() {
    this.service.getNaturezasByUsername()
      .subscribe({
        next: (resposta) => {
          if (resposta == null) {
            this.snackBar.open("Não existem Naturezas, favor cadastrar", "Info!", {
              duration: 5000
            });
          } else {
            this.natureza = resposta;
          }
        },
        error: (responseError) => {
          console.log(responseError);
          this.snackBar.open("Erro ao definir naturezas: ", responseError, {
            duration: 5000
          });
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
          console.log(responseError);
          this.snackBar.open("Erro: ", responseError, {
            duration: 5000
          });
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
          console.log(responseError);
          this.snackBar.open("Erro ao definir tipo lançamento: ", responseError, {
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
      if (this.lancamento.id_natureza == undefined) {
        this.snackBar.open("Informe uma natureza para o Lançamento!", "Info:", {
          duration: 4000
        });
      } else {
        if (this.lancamento.descricao == '' || this.lancamento.descricao == undefined) {
          this.snackBar.open("Informe uma descrição para o Lançamento!", "Info:", {
            duration: 4000
          });
        } else {
          if (!this.lancamento.data_referencia) {
            this.snackBar.open("Informe a data de referência para o Lançamento!", "Info:", {
              duration: 4000
            });
          } else {
            if (this.lancamento.valor_total == undefined || this.lancamento.valor_total <= 0) {
              this.snackBar.open("Informe o valor total do Lançamento!", "Info:", {
                duration: 4000
              });
            } else {
              if (this.lancamento.qtde_parcelas == undefined || this.lancamento.qtde_parcelas <= 0) {
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
    this.service.save(this.lancamento)
      .subscribe({
        next: (_resposta) => {
          this.snackBar.open("Sucesso ao salvar!", "Info!", {
            duration: 4000
          });
          this.fecharDialog();
        },
        error: (responseError) => {
          this.msgErros = responseError.error.parameterViolations;
        }
      });

  }

}
