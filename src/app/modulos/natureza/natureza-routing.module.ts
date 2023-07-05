import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'src/app/componentes/layout/layout.component';
import { NotFoundComponent } from 'src/app/componentes/not-found/not-found.component';
import { AutenticacaoGuard } from 'src/app/guardiao/autenticacao.guard';
import { NaturezaFormComponent } from './natureza-form/natureza-form.component';
import { NaturezaListComponent } from './natureza-list/natureza-list.component';

const routes: Routes = [
  {
    path: 'naturezas', component: LayoutComponent, canActivate: [AutenticacaoGuard], children: [
      { path: 'formulario', component: NaturezaFormComponent, title: 'Cadastrar Natureza' },
      { path: 'lista', component: NaturezaListComponent, title: 'Listagem de Naturezas' },
      { path: '', redirectTo: '/naturezas/lista', pathMatch: 'full' },
      { path: '**', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NaturezaRoutingModule { }
