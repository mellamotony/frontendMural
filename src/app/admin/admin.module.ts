import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AdminMainComponent } from './pages/layout/admin-main/admin-main.component';
import { AdminRoutingModule } from './admin-routing.component';
import { ListadoUsuariosComponent } from './pages/listado-usuarios/listado-usuarios.component';
import { PrimeNModule } from '../prime-n/prime-n.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    AdminRoutingModule,
    PrimeNModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  exports: [],
  declarations: [
    AdminMainComponent,
    ListadoUsuariosComponent
  ],
  providers: [],
})
export class AdminModule { }
