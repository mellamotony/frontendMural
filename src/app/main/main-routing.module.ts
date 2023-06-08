import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { CreateMuralComponent } from './pages/create-mural/create-mural.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EstadoComponent } from './pages/estado/estado.component';

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
      }
    ]
  },{
    path:'**',
    redirectTo:'/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
