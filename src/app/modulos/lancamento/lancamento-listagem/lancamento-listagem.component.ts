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
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';



@Component({
  selector: 'app-lancamento-listagem',
  templateUrl: './lancamento-listagem.component.html',
  styleUrls: ['./lancamento-listagem.component.css']
})
export class LancamentoListagemComponent implements OnInit {


  total_lancamentos: number = 0;
  displayedColumns: string[] = ['selecionado', 'valorParcela', 'dataLancamento', 'descricao', 'situacao',
    'nrParcela', 'qtdeParcelas', 'natureza', 'origem', 'dataCriacao', 'nomeAnexo', 'edit', 'delete',];

  dataSource: MatTableDataSource<LancamentoDTOResponse> = new MatTableDataSource;

  listaLancamentos: LancamentoDTOResponse[] = [];
  saldoPeriodo: string = '';
  entradasPeriodo: string = '';
  saidasPeriodo: string = '';
  mesExtenso: string = '';

  lancamentoDeletar: LancamentoDTOResponse = new LancamentoDTOResponse;
  tipoLancamento: any[] = [];
  origemEnum: any[] = [];
  situacaoLancamento: any[] = [];

  lancamentoFilter: LancamentoFilterDTO = new LancamentoFilterDTO;

  naturezas: NaturezaNewDTO[] = [];

  selecao = new SelectionModel<LancamentoDTOResponse>(false);
  itemSelecionado = new Set<LancamentoDTOResponse>();

  listaIdSelecionados: string[] = [];

  tipeOperacaoLancamento: any


  constructor(
    private service: LancamentoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private avisoDialogService: AvisosDialogService,
    private loadingService: LoadingService,
    private router: Router
  ) { }



  ngOnInit(): void {
    this.definirTipo();
    this.definirComboFiltroSituacao();
    this.definirNatureza();
    this.definirOrigemEnum();

    const filtrosSalvos = sessionStorage.getItem('filtrosLancamento');
    if (filtrosSalvos) {
      this.lancamentoFilter = JSON.parse(filtrosSalvos);
      this.listagemPersonalizada();
    } else {
      this.listagemMesAtual();
    }
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
            this.naturezas = resposta;
          }
        },
        error: (erroDefinirNatureza) => {
          this.loadingService.hide();
          console.error(erroDefinirNatureza);
          this.handleError("Erro ao Obter naturezas ");
        }
      });
  }


  definirTipo() {
    this.loadingService.show();
    this.service.findAllTipo()
      .subscribe({
        next: (resposta) => {
          this.loadingService.hide();
          this.tipoLancamento = resposta;
        },
        error: (erroDefinirTipo) => {
          this.loadingService.hide();
          console.error(erroDefinirTipo);
          this.handleError("Erro ao obter lista de Tipos ");
        }
      });
  }

  definirComboFiltroSituacao() {
    this.loadingService.show();
    this.service.findAllSituacao()
      .subscribe({
        next: (resposta) => {
          this.loadingService.hide();
          this.situacaoLancamento = resposta;
        },
        error: (erroDefinirSituacao) => {
          this.loadingService.hide();
          console.error(erroDefinirSituacao);
          this.handleError("Erro ao obter Situação filtro.");
        }
      });
  }


  definirOrigemEnum() {
    this.loadingService.show();
    this.service.findAllOrigem()
      .subscribe({
        next: (resposta) => {
          this.loadingService.hide();
          this.origemEnum = resposta;
        },
        error: (erroDefinirOrigemEnum) => {
          this.loadingService.hide();
          console.error(erroDefinirOrigemEnum);
          this.handleError("Erro ao obter Origem Enum.");
        }
      });
  }


  listagemMesAtual() {    
    this.loadingService.show();
     this.service.finByIdUserDataMesAtual()
      .subscribe({
        next: (resposta) => {
          this.lancamentoFilter.dataInicio = resposta.dataInicio;
          this.lancamentoFilter.dataFim = resposta.dataFim;
          this.total_lancamentos = resposta.totalLancamentos;
          this.listaLancamentos = resposta.lancamentos;

          this.dataSource = new MatTableDataSource(this.listaLancamentos);
          this.definirInfo();
          this.loadingService.hide();
        },
        error: (erroListagemMesAtual) => {
          this.loadingService.hide();
          console.error(erroListagemMesAtual);
          this.handleError("Erro ao obter Lançamentos do mÊs atual ");
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


    this.mesExtenso = this.lancamentoFilter.dataInicio;
    console.log(this.mesExtenso);

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  listagemPersonalizada() {

    this.loadingService.show();

    let natureza = this.lancamentoFilter.idNatureza;
    let tipo = this.lancamentoFilter.tipo;
    let origem = this.lancamentoFilter.origem;
    let situacao = this.lancamentoFilter.situacao;

    if (natureza == 'TUDO') {
      this.lancamentoFilter.idNatureza = null;
    }
    if (tipo == 'TUDO') {
      this.lancamentoFilter.tipo = null;
    }
    if (origem == 'TUDO') {
      this.lancamentoFilter.origem = null;
    }
    if (situacao == 'TUDO') {
      this.lancamentoFilter.situacao = null;
    }

    if (this.lancamentoFilter.dataInicio && this.lancamentoFilter.dataFim) {

      sessionStorage.setItem('filtrosLancamento', JSON.stringify(this.lancamentoFilter));

      this.service.finByIdUserDataFilter(this.lancamentoFilter)
        .subscribe({
          next: (resposta) => {
            this.lancamentoFilter.dataInicio = resposta.dataInicio;
            this.lancamentoFilter.dataFim = resposta.dataFim;
            this.total_lancamentos = resposta.totalLancamentos;
            this.listaLancamentos = resposta.lancamentos
            this.dataSource = new MatTableDataSource(this.listaLancamentos);
            this.definirInfo();
            this.loadingService.hide();
          },
          error: (erroListagemPersonalizada) => {
            this.loadingService.hide();
            console.error(erroListagemPersonalizada);
            this.handleError("Erro ao aplicar Filtros!");
          }
        });

    } else {
      this.loadingService.hide();
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


  selecionarLancamentoDeletar(lancamento: LancamentoDTOResponse) {
    this.lancamentoDeletar = lancamento;
  }

  deletarLancamento() {    
    this.avisoDialogService.openConfirmationDialog("Tem certeza?")
      .then(result => {  
        if (result) {
          this.loadingService.show();
          this.service.deletarporLancamentoId(this.lancamentoDeletar.id)
            .subscribe({
              next: (_resposta) => {
                this.loadingService.hide();
                this.snackBar.open("Sucesso ao deletar!", "Sucess!", {
                  duration: 2000
                });

                if (this.filtroExistente()) {
                  this.listagemPersonalizada();
                } else {
                  this.listagemMesAtual();
                }
              },
              error: (erroDeletar) => {
                this.loadingService.hide();
                console.error(erroDeletar);
                this.handleError("Erro ao deletar!");
              }
            });
        } else {
          this.snackBar.open("Processo cancelado!", "Cancelado!", {
            duration: 3000
          });
        }
      });
  }


  private operacaoPersonalizadaLancamentos() {
    if (this.listaIdSelecionados.length > 0) { 

      const mensagem = this.tipeOperacaoLancamento == 1? 
        'Confirma a exclusão de ( ' + this.listaIdSelecionados.length + ' ) Lançamento(s)?' : 
        'Deseja marcar ( ' + this.listaIdSelecionados.length + ' ) Lançamento(s) como pago(s)?';
        
      this.avisoDialogService.openConfirmationDialog(mensagem).then(result => {
        if (result) {
          this.loadingService.show();
          this.service.operacaoPersonalizada(this.listaIdSelecionados, this.tipeOperacaoLancamento )
            .subscribe({
              next: (_resposta) => {
                this.loadingService.hide();
                this.snackBar.open("Sucesso ao processar Lançamento(s)!", "Sucess!", {
                  duration: 2000
                });
                this.listaIdSelecionados = [];
                if (this.filtroExistente()) {
                  this.listagemPersonalizada();
                } else {
                  this.listagemMesAtual();
                }       
              },
              error: (_erroDeletarMultiplos) => {
                this.loadingService.hide();
                this.handleError("Erro ao processar!");
              }
            });

        } else {
          this.snackBar.open("Processo cancelado!", "Cancelado!", {
            duration: 3000
          });
        }
      });
    }
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
          this.loadingService.show();
          this.service.uploadFile(formData, id)
            .subscribe({
              next: (_resposta) => {
                this.loadingService.hide();
                if (this.filtroExistente()) {
                  this.listagemPersonalizada();
                } else {
                  this.listagemMesAtual();
                }            
              },
              error: (_erroUpload) => {
                this.loadingService.hide();
                this.handleError("Erro ao efetuar UPLOAD!");
              }
            });
        } else {
          this.snackBar.open("UPLOAD cancelado!", "Cancelado!", {
            duration: 3000
          });
        }
      });
  }



  baixar(id: number) {
    this.avisoDialogService.openConfirmationDialog("Deseja baixar o Anexo? ")
      .then(result => {
        if (result) {
          this.loadingService.show();
          this.service.baixarAnexoByIdLancamento(id)
            .subscribe({
              next: (resposta) => {
                this.loadingService.hide();
                const sampleArr = this.base64ToArrayBufferAngular16(resposta.anexo);
                this.saveByteArray(resposta, sampleArr);
              },
              error: (_erroBaixar) => {
                this.loadingService.hide();
                this.handleError("Erro ao efetuar DOWNLOAD!");
              }
            });
        } else {
          this.snackBar.open("Download cancelado!", "Cancelado!", {
            duration: 3000
          });
        }
      });
  }


  verAnexo(idLancamento: number): void {
    this.loadingService.show();
    this.service.baixarAnexoByIdLancamento(idLancamento)
      .subscribe({
        next: (resposta) => {
          this.loadingService.hide();
          const sampleArr = this.base64ToArrayBufferAngular16(resposta.anexo);
          this.abrirArquivoNoNavegador(resposta, sampleArr);
        },
        error: (_erroBaixar) => {
          this.loadingService.hide();
          this.handleError("Erro ao obter anexo!");
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

  private abrirArquivoNoNavegador(arquivo: AnexoDownloaDTO, byte: any) {
    const blob = new Blob([byte], { type: arquivo.type });
    const blobUrl = window.URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  }


  // Função compartilhada para lidar com erros
  private handleError(errorMessage: string) {
    this.snackBar.open(errorMessage, "ERRO!", {
      duration: 4000
    });
  }

  private filtroExistente(): boolean {
    return this.lancamentoFilter.descricao || this.lancamentoFilter.idNatureza ||
      this.lancamentoFilter.tipo || this.lancamentoFilter.dataInicio || this.lancamentoFilter.dataFim;
  }

  editarLancamento(id: number) {
    this.router.navigate(['/lancamento/listagem/' + id]);
  }

  limparFiltros() {
    this.lancamentoFilter = new LancamentoFilterDTO;
    sessionStorage.removeItem('filtrosLancamento');
    this.listagemMesAtual();
    this.listaIdSelecionados = [];
  }

  realizarOperacaoLancamento(){
    if(this.tipeOperacaoLancamento == undefined || !this.tipeOperacaoLancamento){
      this.snackBar.open("Selecione a operação!", "Atenção", {
        duration: 3000
      });
    }else{
      this.operacaoPersonalizadaLancamentos();
    }      
  }
}
