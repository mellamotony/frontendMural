
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SolicituMural } from '../../interfaces/solicitudes.interface';
import { EditorService } from '../../services/editor-services';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css'],
})
export class SolicitudesComponent implements OnInit {
  public products: SolicituMural[] = [ ];
  public activeMessage:boolean = false;
  public date: Date[] = []
  public e?:HTMLElement
  //formulario para guardar las fechas de inicio y fin con sus respectivas horas
  public dataTime:FormGroup = this.fb.group(
    {
      inicio:this.fb.control(['',Validators]),
      fin:this.fb.control(['',Validators])
    }
    )
  constructor(
    private router:Router,
    private mService:EditorService,
    private fb:FormBuilder
    ){}

  ngOnInit() {
    const idUser = localStorage.getItem('id_user')

    this.mService.getSolicitudes().subscribe((datas) =>{

      datas.forEach((data)=>{
        const objSoli:SolicituMural = {
          id_mural:data.id_mural,
          nombre_mural:data.nombrem,
          fecha:data.fecha_solicitud,
          estado:data.estado
        }
        if(objSoli.estado === 'en espera'){
          this.products.push(objSoli)
        }

      })

    });
  }


  onDelete(){
    alert('Eliminando...')
  }
  onPublic(el:Event){
    this.activeMessage = !this.activeMessage


    //obtenemos el padre
    const parentElement = (el.target as HTMLElement).closest('.rowT');
    console.log(parentElement)
    //asignamos el event para obtener unos valores
    this.e = parentElement as HTMLElement
  }

  enviarInfo(){
    const body = {
      id_mural:'',
      id_user:'',
      estado:'aprobado',
      fecha_publicacion: this.dataTime.controls['inicio'].value,
      fin_publicacion: this.dataTime.controls['fin'].value
    }
    console.log(body)
    console.log(this.e?.id)
  }

  onEdit(){
    alert('Editando... pasa id')
    this.router.navigate(['/main/mural'])
  }
}
