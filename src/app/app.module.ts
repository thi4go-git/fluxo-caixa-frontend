import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CoreModule } from './modulos/core/core.module';


// MÓDULO APENAS PARA START DA APLICAÇÃO

@NgModule({
  declarations: [
  ],
  imports: [
    CoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
