import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
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
import { HistorialComponent } from './pages/historial/historial.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { EditMuralComponent } from './pages/edit-mural/edit-mural.component';




@NgModule({
  declarations: [
    DragDropPanelComponent,
    LayoutComponent,
     CreateMuralComponent,
     DashboardComponent,
     EstadoComponent,
     HistorialComponent,
     EditMuralComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    DragDropModule,
    PrimeNModule,
    ReactiveFormsModule,
    PdfViewerModule,
    HttpClientModule,


  ],
  exports:[
    EditMuralComponent,

  ]
})
export class MainModule { }
