import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'src/app/componentes/layout/layout.component';
import { NotFoundComponent } from 'src/app/componentes/not-found/not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from 'src/app/guardiao/autenticacao.guard';
import { MetabaseDashComponent } from './metabase-dash/metabase-dash.component';


const routes: Routes = [
  {
    path: 'graficos', component: LayoutComponent, canActivate: [authGuard], children: [
      { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
      { path: 'dashboard-metabase', component: MetabaseDashComponent, title: 'Dashboard Metabase' },
      { path: '', redirectTo: '/graficos/dashboard-metabase', pathMatch: 'full' },
      { path: '**', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GraficosRoutingModule { }
