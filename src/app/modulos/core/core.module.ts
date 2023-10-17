import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from 'src/app/componentes/confirmation-dialog/confirmation-dialog.component';
import { LayoutComponent } from 'src/app/componentes/layout/layout.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { SharedModule } from '../shared/shared.module';
import { GraficosModule } from '../graficos/graficos.module';
import { LancamentoModule } from '../lancamento/lancamento.module';
import { LoginModule } from '../login/login.module';
import { NaturezaModule } from '../natureza/natureza.module';
import { TemplateModule } from '../template/template.module';
import { TokenInterceptor } from 'src/app/interceptors/token.interceptor';
import { AvisosDialogService } from 'src/app/services/avisos-dialog.service';
import { LancamentoService } from 'src/app/services/lancamento.service';
import { AppComponent } from 'src/app/app.component';
import { NotFoundComponent } from 'src/app/componentes/not-found/not-found.component';
import { DateFormatPipe } from 'src/app/entity-class/date-format-pipe';



@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    LayoutComponent,
    ConfirmationDialogComponent,
    DateFormatPipe,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    SharedModule,

    GraficosModule,
    LancamentoModule,
    LoginModule,
    NaturezaModule,
    TemplateModule
  ], providers: [
    AvisosDialogService,
    LancamentoService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ]
})
export class CoreModule { }
