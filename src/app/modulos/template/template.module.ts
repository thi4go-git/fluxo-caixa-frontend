import { NgModule } from '@angular/core';
import { TemplateRoutingModule } from './template-routing.module';
import { CabecalhoComponent } from './cabecalho/cabecalho.component';
import { MenuComponent } from './menu/menu.component';
import { RodapeComponent } from './rodape/rodape.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    CabecalhoComponent,
    MenuComponent,
    RodapeComponent
  ],
  imports: [
    SharedModule,
    TemplateRoutingModule
  ], exports: [
    CabecalhoComponent,
    MenuComponent,
    RodapeComponent
  ]
})
export class TemplateModule { }
