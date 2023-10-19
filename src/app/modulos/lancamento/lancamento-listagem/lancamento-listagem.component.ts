import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { LancamentoDTOResponse } from 'src/app/model/lancamento/lancamentoDTOResponse';
import { LancamentoFilterDTO } from 'src/app/model/lancamento/lancamentoFilterDTO';
import { LancamentoService } from 'src/app/services/lancamento.service';
import { LancamentoFormComponent } from '../lancamento-form/lancamento-form.component';
import { AvisosDialogService } from 'src/app/services/avisos-dialog.service';
import { SelectionModel } from '@angular/cdk/collections';
import { AnexoDownloaDTO } from 'src/app/model/anexoDownloaDTO';
import { Buffer } from 'buffer';
import { NaturezaNewDTO } from 'src/app/model/natureza/naturezaNewDTO';



@Component({
  selector: 'app-lancamento-listagem',
  templateUrl: './lancamento-listagem.component.html',
  styleUrls: ['./lancamento-listagem.component.css']
})
export class LancamentoListagemComponent implements OnInit {


  total_lancamentos: number = 0;
  displayedColumns: string[] = ['selecionado', 'id', 'valorParcela', 'dataLancamento', 'descricao', 'tipo'
    , 'qtdeParcelas', 'nrParcela', 'natureza', 'dataCriacao', 'nomeAnexo', 'delete', 'download'];

  dataSource: MatTableDataSource<LancamentoDTOResponse> = new MatTableDataSource;

  listaLancamentos: LancamentoDTOResponse[] = [];
  saldoPeriodo: string = '';
  entradasPeriodo: string = '';
  saidasPeriodo: string = '';

  lancamentoDeletar: LancamentoDTOResponse = new LancamentoDTOResponse;
  tipoLancamento: any[] = [];

  lancamentoFilter: LancamentoFilterDTO = new LancamentoFilterDTO;

  naturezas: NaturezaNewDTO[] = [];

  selecao = new SelectionModel<LancamentoDTOResponse>(false);
  itemSelecionado = new Set<LancamentoDTOResponse>();

  listaIdSelecionados: string[] = [];

  mostraProgresso: boolean = false;

  constructor(
    private service: LancamentoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private avisoDialogService: AvisosDialogService
  ) { }



  ngOnInit(): void {
    this.definirTipo();
    this.definirNatureza();
    this.listagemMesAtual();
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
          console.error(responseError);
          this.snackBar.open("Erro ao Obter naturezas ", "Erro!", {
            duration: 2000
          });
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
          console.error(responseError);
          this.snackBar.open("Erro ao obter lista de Tipos ", "Erro!", {
            duration: 2000
          });
        }
      });
  }

  listagemMesAtual() {
    this.mostraProgresso = true;
    this.service.finByIdUserDataMesAtual()
      .subscribe({
        next: (resposta) => {
          this.lancamentoFilter.dataInicio = resposta.dataInicio;
          this.lancamentoFilter.dataFim = resposta.dataFim;
          this.total_lancamentos = resposta.totalLancamentos;
          this.listaLancamentos = resposta.lancamentos;

          this.dataSource = new MatTableDataSource(this.listaLancamentos);
          this.definirInfo();
          this.mostraProgresso = false;
        },
        error: (responseError) => {
          this.mostraProgresso = false; 
          console.error(responseError);
          this.snackBar.open("Erro ao obter Lançamentos do mÊs atual ", "Erro!", {
            duration: 2000
          });
        }
      });
  }


  definirInfo() {
    this.saldoPeriodo = '';
    let sumSaldo = 0;
    let sumEntrada = 0;
    let sumSaida = 0;
    for (let lancamento of this.listaLancamentos) {
      sumSaldo = sumSaldo + lancamento.valorParcela;
      if (lancamento.tipo == 'CREDITO') {
        sumEntrada = sumEntrada + lancamento.valorParcela;
      } else {
        sumSaida = sumSaida + lancamento.valorParcela;
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

    this.mostraProgresso = true;

    let natu = this.lancamentoFilter.idNatureza;
    let tp = this.lancamentoFilter.tipo;
    if (natu == 'TUDO') {
      this.lancamentoFilter.idNatureza = null;
    }
    if (tp == 'TUDO') {
      this.lancamentoFilter.tipo = null;
    }

    if (this.lancamentoFilter.dataInicio && this.lancamentoFilter.dataFim) {

      this.service.finByIdUserDataFilter(this.lancamentoFilter)
        .subscribe({
          next: (resposta) => {
            this.lancamentoFilter.dataInicio = resposta.dataInicio;
            this.lancamentoFilter.dataFim = resposta.dataFim;
            this.total_lancamentos = resposta.totalLancamentos;
            this.listaLancamentos = resposta.lancamentos
            this.dataSource = new MatTableDataSource(this.listaLancamentos);
            this.definirInfo();
            this.mostraProgresso = false;
          },
          error: (responseError) => {
            this.mostraProgresso = false;
            console.error(responseError);
            this.snackBar.open("Erro ao aplicar Filtros!", "Erro!", {
              duration: 5000
            });
          }
        });

    } else {
      this.snackBar.open("Verifique a(s) data(s) informada(s)!", "Erro!", {
        duration: 5000
      });
    }

  }


  novoLancamento() {
    this.dialog.open(LancamentoFormComponent, {
      width: '400px', height: '450px'
    });
  }

  deletarSelecionados() {
    if (this.listaIdSelecionados.length > 0) {
      this.deletarMultiplosLancamentos();
    } else {
      this.snackBar.open("Selecione os lançamentos que deseja deletar!", "INFO!", {
        duration: 5000
      });
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
                console.error(responseError);
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


  private deletarMultiplosLancamentos() {
    this.avisoDialogService.openConfirmationDialog("Confirma a exclusão de ( " + this.listaIdSelecionados.length + ' ) Lançamento(s)?')
      .then(result => {
        if (result) {
          this.mostraProgresso = true;
          this.service.deletarMultiplosLancamentos(this.listaIdSelecionados)
            .subscribe({
              next: (_resposta) => {
                this.snackBar.open("Sucesso ao deletar Lançamento(s)!", "Sucess!", {
                  duration: 2000
                });
                this.listaIdSelecionados = [];
                this.listagemMesAtual();
                this.mostraProgresso = false;
              },
              error: (responseError) => {
                this.mostraProgresso = false;
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

  populaListaSelecionados(lancamento: LancamentoDTOResponse) {
    if (lancamento.selecionado != undefined && lancamento.selecionado) {
      this.listaIdSelecionados.push(lancamento.id.toString());
    } else {
      const indexRemover = this.listaIdSelecionados.indexOf(lancamento.id.toString());
      if (indexRemover !== -1) {
        this.listaIdSelecionados.splice(indexRemover, 1);
      }
    }
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
    this.avisoDialogService.openConfirmationDialog("Deseja realizar o UPLOAD do Anexo? ")
      .then(result => {
        if (result) {
          this.mostraProgresso = true;
          this.service.uploadFile(formData, id)
            .subscribe({
              next: (_resposta) => {
                this.listagemMesAtual();
                this.mostraProgresso = false;
              },
              error: (_responseError) => {
                this.mostraProgresso = false;
                this.snackBar.open("Erro ao efetuar UPLOAD!", "ERRO!", {
                  duration: 3000
                });
              }
            });
        } else {
          this.mostraProgresso = false;
          this.snackBar.open("UPLOAD cancelado!", "Cancelado!", {
            duration: 3000
          });
          this.listagemMesAtual();
        }
      });
  }



  baixar(id: number) {
    this.avisoDialogService.openConfirmationDialog("Deseja baixar o Anexo? ")
      .then(result => {
        if (result) {
          this.mostraProgresso = true;
          this.service.downloadFile(id)
            .subscribe({
              next: (resposta) => {
                const sampleArr = this.base64ToArrayBufferAngular16(resposta.anexo);
                this.saveByteArray(resposta, sampleArr);
                this.mostraProgresso = false;
              },
              error: (_responseError) => {
                this.mostraProgresso = false;
                this.snackBar.open("Erro ao efetuar DOWNLOAD!", "ERRO!", {
                  duration: 3000
                });
              }
            });
        } else {
          this.mostraProgresso = false;
          this.snackBar.open("Download cancelado!", "Cancelado!", {
            duration: 3000
          });
        }
      });
  }


  private base64ToArrayBufferAngular16(base64: any) {
    // instalar a dep:  npm i buffer && npm install --save-dev @types/node 
    // configurar o types node no tsconfig.json  "types": [   "node",] (Dentro de compilerOptions )
    // Usar o: import { Buffer } from 'buffer';
    //(Buffer.from) Usar do angular 16 adiante.
    if (base64) {
      var binaryString = Buffer.from(base64, 'base64');
      var bytes = new Uint8Array(binaryString.length);
      for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString[i];
      }
      return bytes;
    } else {
      console.error("base64 está indefinido ou vazio");
      return null;
    }
  }

  private saveByteArray(arquivo: AnexoDownloaDTO, byte: any) {
    var blob = new Blob([byte], { type: arquivo.type });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = arquivo.nome;
    link.download = fileName;
    link.click();
  }

}
