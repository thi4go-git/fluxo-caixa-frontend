import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LayoutComponent } from './componentes/layout/layout.component';
import { SharedModule } from './modulos/shared/shared.module';
import { TemplateModule } from './modulos/template/template.module';

// MÓDULO APENAS PARA START DA APLICAÇÃO

@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    SharedModule,
    TemplateModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
