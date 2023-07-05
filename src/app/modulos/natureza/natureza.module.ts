import { NgModule } from '@angular/core';

import { NaturezaRoutingModule } from './natureza-routing.module';
import { NaturezaFormComponent } from './natureza-form/natureza-form.component';
import { NaturezaListComponent } from './natureza-list/natureza-list.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    NaturezaFormComponent,
    NaturezaListComponent
  ],
  imports: [
    SharedModule,
    NaturezaRoutingModule

  ], exports: [
    NaturezaFormComponent,
    NaturezaListComponent
  ]
})
export class NaturezaModule { }
