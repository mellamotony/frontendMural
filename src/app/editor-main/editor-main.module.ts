import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorMainRoutingModule } from './editor-main-routing.module';
import { LayoutEComponent } from './pages/layout-e/layout-e.component';
import { SolicitudesComponent } from './pages/solicitudes/solicitudes.component';
import { HistorialComponent } from './pages/historial/historial.component';
import { PrimeNModule } from '../prime-n/prime-n.module';


@NgModule({
  declarations: [
    LayoutEComponent,
    SolicitudesComponent,
    HistorialComponent
  ],
  imports: [
    CommonModule,
    EditorMainRoutingModule,
    PrimeNModule,
    HttpClientModule,
    ReactiveFormsModule
  ]
})
export class EditorMainModule { }
