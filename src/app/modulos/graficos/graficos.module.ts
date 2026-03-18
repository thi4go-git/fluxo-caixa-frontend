import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { GraficosRoutingModule } from './graficos-routing.module';
import { MetabaseDashComponent } from './metabase-dash/metabase-dash.component';


@NgModule({
  declarations: [
    DashboardComponent,
    MetabaseDashComponent
  ],
  imports: [
    SharedModule,
    GraficosRoutingModule
  ], exports: [
    DashboardComponent,
    MetabaseDashComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GraficosModule { }
