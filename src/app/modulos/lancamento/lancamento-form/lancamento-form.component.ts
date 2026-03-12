import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LancamentoService } from 'src/app/services/lancamento.service';
import { ParameterViolations } from 'src/app/model/parameterViolations';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { AvisosDialogService } from 'src/app/services/avisos-dialog.service';
import { NaturezaNewDTO } from 'src/app/model/natureza/naturezaNewDTO';
import { LancamentoNewDTO } from 'src/app/model/lancamento/lancamentoNewDTO';
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
    private auth: AutenticacaoService,
    private avisoDialogService: AvisosDialogService,
    private loadingService: LoadingService
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
            this.avisoDialogService.notificar(
              "Não existem Naturezas, favor cadastrar",
              "Info!"
            ); 
          } else {
            this.natureza = resposta;
          }
        },
        error: (errorDefinirNatureza) => {
          this.loadingService.hide();
          console.error(errorDefinirNatureza);
          this.avisoDialogService.notificar(
              "Erro ao definir naturezas: ",
              errorDefinirNatureza
          ); 
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
          this.avisoDialogService.notificar(
              "Erro: ",
              erroDefinirSituacao
          ); 
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
          this.avisoDialogService.notificar(
              "Erro ao definir tipo lançamento: ",
              erroDefinirTipo
          ); 
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
          this.avisoDialogService.notificar(
              "Erro ao definir Origem lançamento: ",
              erroDefinirOrigem
          ); 
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
            this.avisoDialogService.notificar(
              "Processo cancelado!",
              "Cancelado!"
            ); 
          }
        });
    }
  }

  validarLancamento(): boolean {

    if (this.lancamento.tipo == undefined) {
      this.avisoDialogService.notificar(
        "Informe um tipo para o Lançamento!",
        "Info:"
      ); 
    } else {
      if (this.lancamento.idNatureza == undefined) {
        this.avisoDialogService.notificar(
          "Informe uma natureza para o Lançamento!",
          "Info:"
        ); 
      } else {
        if (this.lancamento.descricao == '' || this.lancamento.descricao == undefined) {
          this.avisoDialogService.notificar(
            "Informe uma descrição para o Lançamento!",
            "Info:"
          ); 
        } else {
          if (!this.lancamento.dataReferencia) {
            this.avisoDialogService.notificar(
              "Informe a data de referência para o Lançamento!",
              "Info:"
            ); 
          } else {
            if (this.lancamento.valorTotal == undefined || this.lancamento.valorTotal <= 0) {
              this.avisoDialogService.notificar(
                "Informe o valor total do Lançamento!",
                "Info:"
              ); 
            } else {
              if (this.lancamento.qtdeParcelas == undefined || this.lancamento.qtdeParcelas <= 0) {
                this.avisoDialogService.notificar(
                  "Informe a qtde de parcelas!",
                  "Info:"
                ); 
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
          this.avisoDialogService.notificar(
            "Sucesso ao salvar!",
            "Info!"
          ); 
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
