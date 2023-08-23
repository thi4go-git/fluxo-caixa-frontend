import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { LancamentoDTOResponse } from 'src/app/entity-class/lancamentoDTOResponse';
import { LancamentoFilterDTO } from 'src/app/entity-class/lancamentoFilterDTO';
import { NaturezaDTO } from 'src/app/entity-class/naturezaDTO';
import { LancamentoService } from 'src/app/services/lancamento.service';
import { LancamentoFormComponent } from '../lancamento-form/lancamento-form.component';
import { AvisosDialogService } from 'src/app/services/avisos-dialog.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-lancamento-listagem',
  templateUrl: './lancamento-listagem.component.html',
  styleUrls: ['./lancamento-listagem.component.css']
})
export class LancamentoListagemComponent implements OnInit {


  total_lancamentos: number = 0;
  displayedColumns: string[] = ['selecionado', 'id', 'valor_parcela', 'data_lancamento', 'descricao', 'tipo'
    , 'qtde_parcelas', 'nr_parcela', 'natureza', 'delete'];

  dataSource: MatTableDataSource<LancamentoDTOResponse> = new MatTableDataSource;

  listaLancamentos: LancamentoDTOResponse[] = [];
  saldoPeriodo: string = '';
  entradasPeriodo: string = '';
  saidasPeriodo: string = '';

  lancamentoDeletar: LancamentoDTOResponse = new LancamentoDTOResponse;
  tipoLancamento: any[] = [];

  lancamentoFilter: LancamentoFilterDTO = new LancamentoFilterDTO;

  naturezas: NaturezaDTO[] = [];

  selecao = new SelectionModel<LancamentoDTOResponse>(false);
  itemSelecionado = new Set<LancamentoDTOResponse>();

  constructor(
    private service: LancamentoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private avisoDialogService: AvisosDialogService
  ) { }



  ngOnInit(): void {
    this.listagemMesAtual();
    this.definirTipo();
    this.definirNatureza();
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
            this.naturezas = resposta;
          }
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
          this.tipoLancamento = resposta;
        },
        error: (responseError) => {
          console.log("Erro");
          console.log(responseError);
        }
      });
  }

  listagemMesAtual() {
    this.service.finByIdUserDataMesAtual()
      .subscribe({
        next: (resposta) => {
          this.lancamentoFilter.data_inicio = resposta.data_inicio;
          this.lancamentoFilter.data_fim = resposta.data_fim;
          this.total_lancamentos = resposta.total_lancamentos;
          this.listaLancamentos = resposta.lancamentos;

          this.dataSource = new MatTableDataSource(this.listaLancamentos);
          this.definirInfo();
        },
        error: (responseError) => {
          console.log("Erro");
          console.log(responseError);
        }
      });
  }


  definirInfo() {
    this.saldoPeriodo = '';
    let sumSaldo = 0;
    let sumEntrada = 0;
    let sumSaida = 0;
    for (let lancamento of this.listaLancamentos) {
      sumSaldo = sumSaldo + lancamento.valor_parcela;
      if (lancamento.tipo == 'CREDITO') {
        sumEntrada = sumEntrada + lancamento.valor_parcela;
      } else {
        sumSaida = sumSaida + lancamento.valor_parcela;
      }
    }
    this.saldoPeriodo =
      sumSaldo.toLocaleString(undefined,
        { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    this.entradasPeriodo =
      sumEntrada.toLocaleString(undefined,
        { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    this.saidasPeriodo =
      sumSaida.toLocaleString(undefined,
        { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  listagemPersonalizada() {
    let natu = this.lancamentoFilter.id_natureza;
    let tp = this.lancamentoFilter.tipo;
    if (natu == 'TUDO') {
      this.lancamentoFilter.id_natureza = null;
    }
    if (tp == 'TUDO') {
      this.lancamentoFilter.tipo = null;
    }

    console.log(this.lancamentoFilter);


    this.service.finByIdUserDataFilter(this.lancamentoFilter)
      .subscribe({
        next: (resposta) => {
          this.lancamentoFilter.data_inicio = resposta.data_inicio;
          this.lancamentoFilter.data_fim = resposta.data_fim;
          this.total_lancamentos = resposta.total_lancamentos;
          this.listaLancamentos = resposta.lancamentos
          this.dataSource = new MatTableDataSource(this.listaLancamentos);
          this.definirInfo();
        },
        error: (responseError) => {
          console.log(responseError);
          this.snackBar.open("Erro ao aplicar Filtros!", "Erro!", {
            duration: 5000
          });
        }
      });

  }


  novoLancamento() {
    this.dialog.open(LancamentoFormComponent, {
      width: '400px', height: '450px'
    });
  }

  deletarSelecionados() {
    const listaIdSelecionados: string[] = [];
    this.dataSource.filteredData.forEach(lancamento => {
      if (lancamento.selecionado != undefined && lancamento.selecionado) {
        listaIdSelecionados.push(lancamento.id.toString());
      }
    });

    if (listaIdSelecionados.length == 0) {
      this.snackBar.open("Selecione os lançamentos que deseja deletar!", "INFO!", {
        duration: 5000
      });
    } else {
      this.deletarMultiplosLancamentos(listaIdSelecionados);
    }
  }


  selecionarLancamentoDeletar(lancamento: LancamentoDTOResponse) {
    this.lancamentoDeletar = lancamento;
  }


  deletarLancamento() {
    this.avisoDialogService.openConfirmationDialog("Tem certeza?")
      .then(result => {
        if (result) {

          this.service.deletarporLancamentoId(this.lancamentoDeletar.id)
            .subscribe({
              next: (_resposta) => {

                this.snackBar.open("Sucesso ao deletar!", "Sucess!", {
                  duration: 2000
                });

                this.listagemMesAtual();
              },
              error: (responseError) => {
                console.log(responseError);
                this.snackBar.open("Erro ao deletar!", responseError, {
                  duration: 5000
                });
              }
            });

        } else {
          this.snackBar.open("Processo cancelado!", "Cancelado!", {
            duration: 3000
          });
        }
      });
  }


  deletarMultiplosLancamentos(listaIdSelecionados: string[]) {
    this.avisoDialogService.openConfirmationDialog("Confirma a exclusão de ( " + listaIdSelecionados.length + ' ) Lançamento(s)?')
      .then(result => {
        if (result) {

          this.service.deletarMultiplosLancamentos(listaIdSelecionados)
            .subscribe({
              next: (_resposta) => {

                this.snackBar.open("Sucesso ao deletar Lançamento(s)!", "Sucess!", {
                  duration: 2000
                });

                this.listagemMesAtual();
              },
              error: (responseError) => {
                console.log(responseError);
                this.snackBar.open("Erro ao deletar!", responseError, {
                  duration: 5000
                });
              }
            });

        } else {
          this.snackBar.open("Processo cancelado!", "Cancelado!", {
            duration: 3000
          });
        }
      });
  }


  selecionaLinha(lancamento: LancamentoDTOResponse) {
    this.selecao.toggle(lancamento);
    if (this.itemSelecionado.has(lancamento)) {
      this.itemSelecionado.clear();
    } else {
      this.itemSelecionado.clear();
      this.itemSelecionado.add(lancamento);
    }
  }


}
