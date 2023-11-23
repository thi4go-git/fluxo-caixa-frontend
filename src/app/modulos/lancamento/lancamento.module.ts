import { NgModule } from '@angular/core';
import { LancamentoRoutingModule } from './lancamento-routing.module';
import { LancamentoListagemComponent } from './lancamento-listagem/lancamento-listagem.component';
import { LancamentoFormComponent } from './lancamento-form/lancamento-form.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    LancamentoListagemComponent,
    LancamentoFormComponent    
  ],
  imports: [
    SharedModule,
    LancamentoRoutingModule
  ], exports: [
    LancamentoListagemComponent,
    LancamentoFormComponent
  ]
})
export class LancamentoModule { }
