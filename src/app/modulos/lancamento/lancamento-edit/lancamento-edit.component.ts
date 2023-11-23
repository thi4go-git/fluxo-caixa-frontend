import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { LancamentoDTOResponse } from 'src/app/model/lancamento/lancamentoDTOResponse';
import { NaturezaNewDTO } from 'src/app/model/natureza/naturezaNewDTO';
import { AvisosDialogService } from 'src/app/services/avisos-dialog.service';
import { LancamentoService } from 'src/app/services/lancamento.service';

@Component({
  selector: 'app-lancamento-edit',
  templateUrl: './lancamento-edit.component.html',
  styleUrls: ['./lancamento-edit.component.css']
})
export class LancamentoEditComponent implements OnInit {

  id: number = 0;
  lancamento: LancamentoDTOResponse;
  mostraProgresso: boolean = false;
  listaErros: string[] = [];
  tipoLancamento: any[] = [];
  naturezaLancamento: NaturezaNewDTO[] = [];
  situacaoLancamento: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: LancamentoService,
    private snackBar: MatSnackBar,
    private avisoDialogService: AvisosDialogService
  ) {
    this.lancamento = new LancamentoDTOResponse();
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

  private processoInicial() {
    this.obterLancamentoById();
    this.definirComboBoxTipo();
    this.definirComboBoxNatureza();
    this.definirComboBoxSituacao();
  }

  private obterLancamentoById() {
    this.mostraProgresso = true;
    this.service
      .getLancamentoById(this.id).subscribe({
        next: (resposta) => {
          this.lancamento = resposta;
          this.mostraProgresso = false;
        },
        error: (_errorResponse) => {
          this.mostraProgresso = false;
          this.snackBar.open("Erro ao obter Lançamento pelo id ", "Erro!", {
            duration: 2000
          });
        }
      });
  }

  private definirComboBoxTipo() {
    this.mostraProgresso = true;
    this.service
      .findAllTipo().subscribe({
        next: (resposta) => {
          this.tipoLancamento = resposta;
          this.mostraProgresso = false;
        },
        error: (_errorResponse) => {
          this.mostraProgresso = false;
          this.snackBar.open("Erro ao obter tipos Lançamento", "Erro!", {
            duration: 2000
          });
        }
      });
  }

  private definirComboBoxNatureza() {
    this.mostraProgresso = true;
    this.service
      .getNaturezasByUsername().subscribe({
        next: (resposta) => {
          this.naturezaLancamento = resposta;
          this.mostraProgresso = false;
        },
        error: (_errorResponse) => {
          this.mostraProgresso = false;
          this.snackBar.open("Erro ao obter Naturezas do Usuário.", "Erro!", {
            duration: 2000
          });
        }
      });
  }

  private definirComboBoxSituacao() {
    this.mostraProgresso = true;
    this.service
      .findAllSituacao().subscribe({
        next: (resposta) => {
          this.situacaoLancamento = resposta;
          this.mostraProgresso = false;
        },
        error: (_errorResponse) => {
          this.mostraProgresso = false;
          this.snackBar.open("Erro ao obter Lista Situação.", "Erro!", {
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
          this.mostraProgresso = true;
          this.service.uploadFile(formData, id)
            .subscribe({
              next: (_resposta) => {
                this.mostraProgresso = false;
                this.snackBar.open("Sucesso ao salvar anexo para o Lançamento!", "SUCESSO!", {
                  duration: 3000
                });
                this.processoInicial();
              },
              error: (_erroUpload) => {
                this.mostraProgresso = false;
                this.snackBar.open("Erro ao realziar upload.", "Erro!", {
                  duration: 2000
                });
              }
            });

        } else {
          this.mostraProgresso = false;
          this.snackBar.open("UPLOAD cancelado!", "Cancelado!", {
            duration: 3000
          });
        }
      });
  }


  onSubmit() {
    this.avisoDialogService.openConfirmationDialog("Confirmar Atualização? ")
      .then(result => {
        if (result) {
          this.atualizarLancamento();
        } else {
          this.mostraProgresso = false;
          this.snackBar.open("Atualização cancelada!", "Cancelado!", {
            duration: 3000
          });
        }
      });
  }

  private atualizarLancamento() {
    console.log(this.lancamento);
  }

}


