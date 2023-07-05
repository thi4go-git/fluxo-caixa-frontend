import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './componentes/layout/layout.component';
import { LoginFormComponent } from './modulos/login/login-form/login-form.component';



const routes: Routes = [
    { path: '', redirectTo: '/graficos/dashboard', pathMatch: 'full' },
    { path: 'login', component: LoginFormComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }