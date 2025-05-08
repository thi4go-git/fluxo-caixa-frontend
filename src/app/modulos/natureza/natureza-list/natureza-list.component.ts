import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { LancamentoService } from 'src/app/services/lancamento.service';
import { NaturezaFormComponent } from '../natureza-form/natureza-form.component';
import { SelectionModel } from '@angular/cdk/collections';
import { AvisosDialogService } from 'src/app/services/avisos-dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NaturezaNewDTO } from 'src/app/model/natureza/naturezaNewDTO';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-natureza-list',
  templateUrl: './natureza-list.component.html',
  styleUrls: ['./natureza-list.component.css']
})
export class NaturezaListComponent implements OnInit {


  naturezas: NaturezaNewDTO[] = [];
  dataSource: MatTableDataSource<NaturezaNewDTO> = new MatTableDataSource;
  displayedColumns: string[] = ['id', 'descricao', 'del'];

  selecao = new SelectionModel<NaturezaNewDTO>(false);
  itemSelecionado = new Set<NaturezaNewDTO>();



  constructor(
    private service: LancamentoService,
    private dialog: MatDialog,
    private avisoDialogService: AvisosDialogService,
    private loadingService: LoadingService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.listarNaturezas();
  }

  listarNaturezas() {
    this.loadingService.show();
    this.service.getNaturezasByUsername()
      .subscribe({
        next: (resposta) => {
          this.loadingService.hide();
          this.naturezas = resposta;
          this.dataSource = new MatTableDataSource(this.naturezas);
        },
        error: (responseError) => {
          this.loadingService.hide();
          console.error(responseError);
        }
      });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  novaNatureza() {
    this.dialog.open(NaturezaFormComponent, {
      width: '400px', height: '300px'
    });
  }

  selecionaLinha(natureza: NaturezaNewDTO) {
    this.selecao.toggle(natureza);
    if (this.itemSelecionado.has(natureza)) {
      this.itemSelecionado.clear();
    } else {
      this.itemSelecionado.clear();
      this.itemSelecionado.add(natureza);
    }
  }

  dialogExclusao(natureza: NaturezaNewDTO) {

    this.avisoDialogService.openConfirmationDialog("Confirma a Exclusão da Natureza '"
      + natureza.descricao + "' ?")
      .then(result => {
        if (result) {
          this.excluirNatureza(natureza);
        } else {
          this.snackBar.open("EXCLUSÃO Cancelada!", "Cancelado!", {
            duration: 3000
          });
        }
      });

  }

  excluirNatureza(natureza: NaturezaNewDTO) {
    this.loadingService.show();
    this.service.deletarNaturezaPorId(natureza)
      .subscribe({
        next: (_resposta) => {
          this.loadingService.hide();
          this.snackBar.open("Sucesso ao excluir natureza!", "SUCESSO!", {
            duration: 3000
          });
          this.listarNaturezas();   
        },
        error: (responseError) => {
          this.loadingService.hide();
          console.error(responseError);
          this.snackBar.open(responseError.error.erros, "ERRO!", {
            duration: 6000
          });
        }
      });
  }

}
