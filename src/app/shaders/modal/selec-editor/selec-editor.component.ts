import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { editors } from 'src/app/main/interfaces/mural.interfaces';

@Component({
  selector: 'app-selec-editor',
  templateUrl: './selec-editor.component.html',
  styleUrls: ['./selec-editor.component.css']
})
export class SelecEditorComponent {
@Input()
public editors: editors [] = []

@Output()
idrol = new EventEmitter<string>()

@ViewChild('selectEl', { static: false }) selectEl!: ElementRef;

formIdROl:FormGroup = this.fb.group({
 Rol: this.fb.control('',)
})

constructor(
  private fb:FormBuilder
){}

getIdrol(){
  const selectedValue = this.selectEl.nativeElement.value;
  console.log(selectedValue)
  this.idrol.emit(selectedValue)
}
}
