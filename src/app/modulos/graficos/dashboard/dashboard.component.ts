import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import Chart from 'chart.js/auto'
import { LancamentoDashboardDTO } from 'src/app/entity-class/lancamentoDashboardDTO';
import { LancamentoService } from 'src/app/services/lancamento.service';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  lancamentosDashboard: LancamentoDashboardDTO[] = [];
  sumEntradasPeriodo: string = ''
  sumSaidasPeriodo: string = ''
  sumSalgoGeralPeriodo: string = '';
  ano: number = 0;

  constructor(
    private service: LancamentoService
  ) {  }

  ngOnInit(): void {
    this.carregarListaDash();
  }



  carregarListaDash() {
    this.service.getLancamentosDashboard()
      .subscribe({
        next: (resposta) => {
          this.lancamentosDashboard = resposta.lancamentos;
          this.ano = resposta.ano;

          this.sumEntradasPeriodo =
            resposta.sumEntradas.toLocaleString(undefined,
              { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          this.sumSaidasPeriodo =
            resposta.sumSaidas.toLocaleString(undefined,
              { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          this.sumSalgoGeralPeriodo =
            (resposta.sumEntradas + resposta.sumSaidas).toLocaleString(undefined,
              { minimumFractionDigits: 2, maximumFractionDigits: 2 });


          this.carregarCanvasBarra();
          this.carregarCanvasLinha();

        },
        error: (responseError) => {
          console.log("Erro");
          console.log(responseError);
        }
      });
  }



  @ViewChild("canvasBarra", { static: true }) canvasBarra: ElementRef | undefined
  carregarCanvasBarra() {


    new Chart(this.canvasBarra?.nativeElement, {
      type: 'bar',
      data: {
        labels: this.lancamentosDashboard.map(row => row.mes),
        datasets: [
          {
            label: 'Entradas',
            data: this.lancamentosDashboard.map(row => row.saldo_entradas),
            backgroundColor: ['rgba(0, 0, 255)']
          },
          {
            label: 'Saídas',
            data: this.lancamentosDashboard.map(row => Math.abs(row.saldo_saidas)),
            backgroundColor: ['rgba(255, 0, 0)']
          },
          {
            label: 'Saldo',
            data: this.lancamentosDashboard.map(row => (row.saldo_entradas + row.saldo_saidas)),

            backgroundColor: ['rgba(255, 165, 0)']
          }
        ]
      },
      options: {
        responsive: true
      }
    })

  }



  @ViewChild("canvasLine", { static: true }) canvasLine: ElementRef | undefined
  carregarCanvasLinha() {

    new Chart(this.canvasLine?.nativeElement, {
      type: 'line',
      data: {
        labels: this.lancamentosDashboard.map(row => row.mes),
        datasets: [
          {
            label: 'Entradas',
            data: this.lancamentosDashboard.map(row => row.saldo_entradas),
            //   backgroundColor: ['rgba(4, 177, 255)']
          },
          {
            label: 'Saídas',
            data: this.lancamentosDashboard.map(row => Math.abs(row.saldo_saidas)),
            // backgroundColor: ['rgba(255, 80, 40)']
          },
          {
            label: 'Saldo',
            data: this.lancamentosDashboard.map(row => (row.saldo_entradas + row.saldo_saidas)),

            //  backgroundColor: ['rgba(255, 165, 0)']
          }
        ]
      },
      options: {
        responsive: true
      }
    })

  }


}