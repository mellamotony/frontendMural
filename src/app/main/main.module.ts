import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';

import { LayoutComponent } from './pages/layout/layout.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CreateMuralComponent } from './pages/create-mural/create-mural.component';
import { DragDropPanelComponent } from '../drag-drop-panel/drag-drop-panel.component';


@NgModule({
  declarations: [
    DragDropPanelComponent,
    LayoutComponent,
     CreateMuralComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    DragDropModule
  ]
})
export class MainModule { }
