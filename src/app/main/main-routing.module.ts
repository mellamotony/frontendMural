import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { CreateMuralComponent } from './pages/create-mural/create-mural.component';

const routes: Routes = [
  {
    path:"",
    component:LayoutComponent,

    children:[
      {
        path:'mural',
        component:CreateMuralComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
