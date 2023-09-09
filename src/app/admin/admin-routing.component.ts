import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMainComponent } from './pages/layout/admin-main/admin-main.component';
import { CreateUserComponent } from './pages/create-user/create-user.component';
import { ListadoUsuariosComponent } from './pages/listado-usuarios/listado-usuarios.component';


const routes: Routes = [
  {
    path: "",
    component: AdminMainComponent,
    children: [
      {
        path: "create",
        component: CreateUserComponent

      },

      {
        path: "listado",
        component: ListadoUsuariosComponent

      }
    ],


  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
