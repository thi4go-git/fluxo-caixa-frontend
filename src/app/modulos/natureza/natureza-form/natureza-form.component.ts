import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Natureza } from 'src/app/model/natureza/natureza';
import { ParameterViolations } from 'src/app/model/parameterViolations';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { AvisosDialogService } from 'src/app/services/avisos-dialog.service';
import { LancamentoService } from 'src/app/services/lancamento.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-natureza-form',
  templateUrl: './natureza-form.component.html',
  styleUrls: ['./natureza-form.component.css']
})
export class NaturezaFormComponent {


  natureza: Natureza = new Natureza();
  msgErros: ParameterViolations[] = [];
  listaErros: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<NaturezaFormComponent>,
    private auth: AutenticacaoService,
    private lancamentoService: LancamentoService,
    private loadingService: LoadingService,
    private avisoDialogService: AvisosDialogService,
    private router: Router,
  ) {
    this.natureza.username = auth.getUsuarioAutenticado();
  }

  onSubmit() {
    this.salvarNatureza();
  }

  fecharDialog() {
    this.dialogRef.close();
  }

  salvarNatureza() {
    this.loadingService.show();
    this.lancamentoService.saveNatureza(this.natureza)
      .subscribe({
        next: (_resposta) => {
          this.loadingService.hide();
          this.msgErros = [];
          this.avisoDialogService.notificar(
            "Sucesso Ao Salvar Natureza!",
            "Info!"
          ); 
          this.fecharDialog();
          this.router.navigateByUrl('naturezas/lista');
          window.location.reload();
        },
        error: (responseError) => {
          this.loadingService.hide();
          console.error(responseError);
          this.msgErros = responseError.error.erros
          this.avisoDialogService.notificar(
            "Erro Ao Salvar!",
            "Err!"
          ); 
        }
      });
  }

}
