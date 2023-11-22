import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner/spinner.component';
import { SelecEditorComponent } from './modal/selec-editor/selec-editor.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SpinnerComponent,
    SelecEditorComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports:[SpinnerComponent, SelecEditorComponent]
})
export class ShadersModule { }
