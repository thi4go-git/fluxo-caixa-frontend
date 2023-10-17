import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NaturezaDTO } from 'src/app/entity-class/naturezaDTO';
import { LancamentoService } from 'src/app/services/lancamento.service';
import { NaturezaFormComponent } from '../natureza-form/natureza-form.component';
import { SelectionModel } from '@angular/cdk/collections';
import { AvisosDialogService } from 'src/app/services/avisos-dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-natureza-list',
  templateUrl: './natureza-list.component.html',
  styleUrls: ['./natureza-list.component.css']
})
export class NaturezaListComponent implements OnInit {


  naturezas: NaturezaDTO[] = [];
  dataSource: MatTableDataSource<NaturezaDTO> = new MatTableDataSource;
  displayedColumns: string[] = ['id', 'descricao', 'del'];

  selecao = new SelectionModel<NaturezaDTO>(false);
  itemSelecionado = new Set<NaturezaDTO>();

  mostraProgresso: boolean = false;

  constructor(
    private service: LancamentoService,
    private dialog: MatDialog,
    private avisoDialogService: AvisosDialogService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.listarNaturezas();
  }

  listarNaturezas() {
    this.mostraProgresso = true;
    this.service.getNaturezasByUsername()
      .subscribe({
        next: (resposta) => {
          this.naturezas = resposta;
          this.dataSource = new MatTableDataSource(this.naturezas);
          this.mostraProgresso = false;
        },
        error: (responseError) => {
          this.mostraProgresso = false;
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

  selecionaLinha(natureza: NaturezaDTO) {
    this.selecao.toggle(natureza);
    if (this.itemSelecionado.has(natureza)) {
      this.itemSelecionado.clear();
    } else {
      this.itemSelecionado.clear();
      this.itemSelecionado.add(natureza);
    }
  }

  dialogExclusao(natureza: NaturezaDTO) {

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

  excluirNatureza(natureza: NaturezaDTO) {
    this.mostraProgresso = true;
    this.service.deletarNaturezaPorId(natureza)
      .subscribe({
        next: (_resposta) => {
          this.snackBar.open("Sucesso ao excluir natureza!", "SUCESSO!", {
            duration: 3000
          });
          this.listarNaturezas();
          this.mostraProgresso = false;
        },
        error: (responseError) => {
          this.mostraProgresso = false;
          console.error(responseError);
          this.snackBar.open(responseError.error.erros, "ERRO!", {
            duration: 6000
          });
        }
      });
  }

}
