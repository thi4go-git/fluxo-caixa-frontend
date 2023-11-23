import { NgModule } from '@angular/core';
import { LancamentoRoutingModule } from './lancamento-routing.module';
import { LancamentoListagemComponent } from './lancamento-listagem/lancamento-listagem.component';
import { LancamentoFormComponent } from './lancamento-form/lancamento-form.component';
import { SharedModule } from '../shared/shared.module';
import { LancamentoEditComponent } from './lancamento-edit/lancamento-edit.component';


@NgModule({
  declarations: [
    LancamentoListagemComponent,
    LancamentoFormComponent,
    LancamentoEditComponent
  ],
  imports: [
    SharedModule,
    LancamentoRoutingModule
  ], exports: [
    LancamentoListagemComponent,
    LancamentoFormComponent,
    LancamentoEditComponent
  ]
})
export class LancamentoModule { }
