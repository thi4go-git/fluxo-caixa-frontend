import { NgModule } from '@angular/core';
import { LoginRoutingModule } from './login-routing.module';
import { LoginFormComponent } from './login-form/login-form.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    LoginFormComponent    
  ],
  imports: [
    LoginRoutingModule,
    SharedModule
  ], exports: [
    LoginFormComponent    
  ]
})
export class LoginModule { }
