import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NaturezaDTO } from 'src/app/entity-class/naturezaDTO';
import { LancamentoService } from 'src/app/services/lancamento.service';
import { NaturezaFormComponent } from '../natureza-form/natureza-form.component';

@Component({
  selector: 'app-natureza-list',
  templateUrl: './natureza-list.component.html',
  styleUrls: ['./natureza-list.component.css']
})
export class NaturezaListComponent implements OnInit {


  naturezas: NaturezaDTO[] = [];
  dataSource: MatTableDataSource<NaturezaDTO> = new MatTableDataSource;
  displayedColumns: string[] = ['id', 'descricao'];

  constructor(
    private service: LancamentoService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarNaturezas();
  }

  listarNaturezas() {

    this.service.getNaturezasByUsername()
      .subscribe({
        next: (resposta) => {      
          this.naturezas = resposta;
          this.dataSource = new MatTableDataSource(this.naturezas);
        },
        error: (responseError) => {
          console.log("Erro");
          console.log(responseError);
        }
      });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  novaCategoria() {
    this.dialog.open(NaturezaFormComponent, {
      width: '400px', height: '300px'
    });
  }

}
