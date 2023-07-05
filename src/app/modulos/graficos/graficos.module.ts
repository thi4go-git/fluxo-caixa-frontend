import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';

import { SharedModule } from '../shared/shared.module';
import { GraficosRoutingModule } from './graficos-routing.module';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    SharedModule,
    GraficosRoutingModule
  ], exports: [
    DashboardComponent
  ]
})
export class GraficosModule { }
