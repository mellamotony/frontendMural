import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistorialComponent } from './pages/historial/historial.component';
import { LayoutEComponent } from './pages/layout-e/layout-e.component';
import { SolicitudesComponent } from './pages/solicitudes/solicitudes.component';

const routes: Routes = [
  {
    path:'',
    component:LayoutEComponent,
    children:[
      {
        path:'solicitudes',
        component:SolicitudesComponent
      },
      {
        path:'historial',
        component:HistorialComponent
      },
      {
        path:'**',
        redirectTo:'/editormain/solicitudes'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditorMainRoutingModule { }
