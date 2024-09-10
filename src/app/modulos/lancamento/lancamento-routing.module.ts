import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'src/app/componentes/layout/layout.component';
import { NotFoundComponent } from 'src/app/componentes/not-found/not-found.component';
import { LancamentoFormComponent } from './lancamento-form/lancamento-form.component';
import { LancamentoListagemComponent } from './lancamento-listagem/lancamento-listagem.component';
import { LancamentoEditComponent } from './lancamento-edit/lancamento-edit.component';
import { authGuard } from 'src/app/guardiao/autenticacao.guard';


const routes: Routes = [
  {
    path: 'lancamento', component: LayoutComponent, canActivate: [authGuard], children: [
      { path: 'listagem', component: LancamentoListagemComponent, title: 'Lançamentos Período' },
      { path: 'listagem/:id', component: LancamentoEditComponent, title: 'Edição de Lançamento' },
      { path: 'formulario', component: LancamentoFormComponent, title: 'Novo Lançamento' },
      { path: '', redirectTo: '/lancamento/listagem', pathMatch: 'full' },
      { path: '**', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LancamentoRoutingModule { }
