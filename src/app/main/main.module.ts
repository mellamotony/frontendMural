import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';

import { LayoutComponent } from './pages/layout/layout.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CreateMuralComponent } from './pages/create-mural/create-mural.component';
import { DragDropPanelComponent } from '../drag-drop-panel/drag-drop-panel.component';
import { PrimeNModule } from '../prime-n/prime-n.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EstadoComponent } from './pages/estado/estado.component';


@NgModule({
  declarations: [
    DragDropPanelComponent,
    LayoutComponent,
     CreateMuralComponent,
     DashboardComponent,
     EstadoComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    DragDropModule,
    PrimeNModule
  ]
})
export class MainModule { }
