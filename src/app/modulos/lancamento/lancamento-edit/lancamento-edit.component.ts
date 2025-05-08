import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LancamentoDTOResponse } from 'src/app/model/lancamento/lancamentoDTOResponse';
import { LancamentoUpdateDTO } from 'src/app/model/lancamento/lancamentoUpdateDTO';
import { AvisosDialogService } from 'src/app/services/avisos-dialog.service';
import { LancamentoService } from 'src/app/services/lancamento.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-lancamento-edit',
  templateUrl: './lancamento-edit.component.html',
  styleUrls: ['./lancamento-edit.component.css']
})
export class LancamentoEditComponent implements OnInit {

  id: number;
  lancamento: LancamentoDTOResponse;
  listaErros: string[];
  tipoLancamento: any[];
  naturezaLancamento: any[];
  situacaoLancamento: any[];
  origemLancamento: any[];
  lancamentoUpdate: LancamentoUpdateDTO;

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: LancamentoService,
    private snackBar: MatSnackBar,
    private avisoDialogService: AvisosDialogService,
    private loadingService: LoadingService,
    private router: Router
  ) {
    this.id = 0;
    this.lancamento = new LancamentoDTOResponse();
    this.lancamentoUpdate = new LancamentoUpdateDTO();
    this.listaErros = [];
    this.tipoLancamento = [];
    this.naturezaLancamento = [];
    this.situacaoLancamento = [];
    this.origemLancamento = [];
  }


  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      parametro => {
        if (parametro && parametro['id'] != undefined) {
          this.id = parametro['id'];
          this.processoInicial();
        }
      }
    );
  }

  //o await bloqueia a linha até que seja executada.
  private async processoInicial() {
    await this.definirComboBoxNatureza();
    await this.definirComboBoxTipo();
    await this.definirComboBoxSituacao();
    await this.definirComboBoxOrigem();
    await this.obterLancamentoById();
  }

  private async obterLancamentoById() {
    this.loadingService.show();
    this.service
      .getLancamentoById(this.id).subscribe({
        next: (resposta) => {
          this.lancamento = resposta;
          this.loadingService.hide();
        },
        error: (_errorResponse) => {
          this.loadingService.hide();
          this.snackBar.open("Erro ao obter Lançamento pelo id ", "Erro!", {
            duration: 2000
          });
        }
      });
  }

  private async definirComboBoxTipo() {
    this.loadingService.show();
    this.service
      .findAllTipo().subscribe({
        next: (resposta) => {
          this.tipoLancamento = resposta;
          this.tipoLancamento = this.tipoLancamento.filter(tipo => tipo !== "AMBOS");
          this.loadingService.hide();
        },
        error: (_errorResponse) => {
          this.loadingService.hide();
          this.snackBar.open("Erro ao obter tipos Lançamento", "Erro!", {
            duration: 2000
          });
        }
      });
  }

  private async definirComboBoxNatureza() {
    this.loadingService.show();
    this.service
      .getNaturezasByUsername().subscribe({
        next: (resposta) => {
          resposta.forEach(
            natureza => {
              this.naturezaLancamento.push(natureza.descricao);
            }
          );
          this.loadingService.hide();
        },
        error: (_errorResponse) => {
          this.loadingService.hide();
          this.snackBar.open("Erro ao obter Naturezas do Usuário.", "Erro!", {
            duration: 2000
          });
        }
      });
  }

  private async definirComboBoxSituacao() {
    this.loadingService.show();
    this.service
      .findAllSituacao().subscribe({
        next: (resposta) => {
          this.situacaoLancamento = resposta;
          this.loadingService.hide();
        },
        error: (_errorResponse) => {
          this.loadingService.hide();
          this.snackBar.open("Erro ao obter Lista Situação.", "Erro!", {
            duration: 2000
          });
        }
      });
  }

  private async definirComboBoxOrigem() {
    this.loadingService.show();
    this.service
      .findAllOrigem().subscribe({
        next: (resposta) => {
          this.origemLancamento = resposta;
          this.loadingService.hide();
        },
        error: (_errorResponse) => {
          this.loadingService.hide();
          this.snackBar.open("Erro ao obter Lista Origem.", "Erro!", {
            duration: 2000
          });
        }
      });
  }


  uploadFile(event: any, id: number) {
    const files = event.target.files;
    if (files) {
      const anexo: File = files[0];
      const formData: FormData = new FormData();
      formData.append("anexo", anexo);
      formData.append("nome", anexo.name);
      formData.append("type", anexo.type);
      this.upload(formData, id);
    } else {
      this.snackBar.open("Selecione um arquivo!", "INFO!", {
        duration: 3000
      });
    }
  }

  private upload(formData: FormData, id: number) {
    this.avisoDialogService.openConfirmationDialog("*** ATENÇÃO ESSE PROCESSO PODERÁ SUBSTITUIR UM ANEXO EXISTENTE!!! Deseja SUBSTITUIR/ENVIAR anexo para o Lançamento " + this.lancamento.descricao + " ? ***")
      .then(result => {
        if (result) {
          this.loadingService.show();
          this.service.uploadFile(formData, id)
            .subscribe({
              next: (_resposta) => {
                this.loadingService.hide();
                this.snackBar.open("Sucesso ao salvar anexo para o Lançamento!", "SUCESSO!", {
                  duration: 3000
                });
                this.processoInicial();
              },
              error: (_erroUpload) => {
                this.loadingService.hide();
                this.snackBar.open("Erro ao realziar upload.", "Erro!", {
                  duration: 2000
                });
              }
            });

        } else {
          this.loadingService.hide();
          this.snackBar.open("UPLOAD cancelado!", "Cancelado!", {
            duration: 3000
          });
        }
      });
  }

  voltarParaListagem() {
    this.router.navigate(['/lancamento/listagem']);
  }

  onSubmit() {
    this.avisoDialogService.openConfirmationDialog("Confirmar Atualização? ")
      .then(result => {
        if (result) {
          this.atualizarLancamento();
        } else {
          this.loadingService.hide();
          this.snackBar.open("Atualização cancelada!", "Cancelado!", {
            duration: 3000
          });
        }
      });
  }

  private atualizarLancamento() {
    this.lancamentoUpdate.id = this.lancamento.id;
    this.lancamentoUpdate.tipo = this.lancamento.tipo;
    this.lancamentoUpdate.descricao = this.lancamento.descricao;
    this.lancamentoUpdate.dataLancamento = this.lancamento.dataLancamento;
    this.lancamentoUpdate.valorParcela = this.lancamento.valorParcela;
    this.lancamentoUpdate.natureza = this.lancamento.natureza;
    this.lancamentoUpdate.situacao = this.lancamento.situacao;
    this.lancamentoUpdate.origem = this.lancamento.origem;

    this.loadingService.show();
    this.service.update(this.lancamentoUpdate)
      .subscribe({
        next: (_resposta) => {
          this.listaErros = [];
          this.loadingService.hide();
          this.snackBar.open("Sucesso ao Atualizar Lançamento!", "SUCESSO!", {
            duration: 3000
          });
          this.processoInicial();
        },
        error: (erroUpdate) => {
          this.listaErros = erroUpdate.error.erros
          this.loadingService.hide();
          this.snackBar.open("Erro ao Atualziar Lançamento.", "Erro!", {
            duration: 3000
          });
        }
      });

  }

}


