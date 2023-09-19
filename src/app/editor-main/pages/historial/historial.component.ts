import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HistorialMural, SolicituMural } from '../../interfaces/solicitudes.interface';
import { EditorService } from '../../services/editor-services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {
  public aprobado = 'aprobado'
  public products: SolicituMural[] = [];
  public exito:boolean = true;
  public formEstado:FormGroup = this.fb.group({
    option:this.fb.control(['aprobado',Validators]),
  })

  constructor(
    private route:Router,
    private mService: EditorService,
    private fb:FormBuilder
    ){}

  ngOnInit(): void {
    //se hace una peticion para obtener las solucitudes que esten en espera
    this.mService.getResponse().subscribe((datas) => {
      datas.forEach((data) => {
        this.exito = false
        console.log(data)
        const objSoli: SolicituMural = {
          id_mural: data.id_mural,
          nombre_mural: data.nombrem,
          fecha: data.fecha_respuesta!,
          estado: data.estado,
        };

        // let option =  this.formEstado.controls['option'].value
        // console.log(option[0])
        this.products = this.products.filter((data)=> data.estado !== 'en espera')
        this.products.push(objSoli);

      });
    });
  }

  onVer(){
    this.route.navigate(['/main/mural'])
  }

  cambiarStatus(){
    this.exito = true
    console.log( this.formEstado.get('option')!.value)
    this.aprobado = this.formEstado.get('option')!.value
    this.formEstado.controls['option'].setValue( this.formEstado.get('option')!.value)
    this.products = []
    //se hace una nueva peticion
    this.mService.getResponse().subscribe((datas) => {
      datas.forEach((data) => {
        const objSoli: SolicituMural = {
          id_mural: data.id_mural,
          nombre_mural: data.nombrem,
          fecha: data.fecha_respuesta!,
          estado: data.estado,
        };
        this.exito = false
        let option =  this.formEstado.controls['option'].value
        console.log(option)
        if (objSoli.estado === option) {

          this.products = this.products.filter((data) => data.estado == option )
          this.products.push(objSoli)
        }
      });
    });

  }

  onDelete(){
    alert('Borrando..')
  }
}
