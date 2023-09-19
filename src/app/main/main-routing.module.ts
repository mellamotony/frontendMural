import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { CreateMuralComponent } from './pages/create-mural/create-mural.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EstadoComponent } from './pages/estado/estado.component';
import { HistorialComponent } from './pages/historial/historial.component';
import { EditMuralComponent } from './pages/edit-mural/edit-mural.component';

const routes: Routes = [
  {
    path:"",
    component:LayoutComponent,

    children:[
      {
        path:'mural',
        component:CreateMuralComponent
      },
      {
        path:'dashboard',
        component:DashboardComponent
      },{
        path:'estado',
        component:EstadoComponent
      },
      {
        path:'historial',
        component:HistorialComponent
      },
      {
        path:'edit/:id',
        component:EditMuralComponent
      }
    ]
  },{
    path:'**',
    redirectTo:'/main/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
