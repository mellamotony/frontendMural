
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AprobeMural, RejectMural, SolicituMural } from '../../interfaces/solicitudes.interface';
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


  onDelete(el:Event){
     //obtenemos el padre
     const parentElement = (el.target as HTMLElement).closest('.rowT');
     console.log(parentElement)
     //asignamos el event para obtener unos valores
     this.e = parentElement as HTMLElement

    const body:RejectMural = {
      id_mural:this.e.id,
      estado:'rechazado'
    }
    console.log(body)
    //enviando datos
    this.mService.rejectMural(body).subscribe((data)=>{
      console.log(data)
      if(data.mensaje == 'actualización de estado exitosamente'){
        alert('Mural actualizado con éxito')
        window.location.reload();
      }
    })
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

    //obtenemos las fechas del formulario y lo convertimos en date
    const fecha_inicio:Date = new Date(this.dataTime.controls['inicio'].value)
    const fecha_fin:Date = new Date(this.dataTime.controls['fin'].value)


    const body:AprobeMural = {
      id_mural:this.e!.id,
      id_user:Number(localStorage.getItem('id_user')),
      estado:'aprobado',
      fecha_publicacion: this.cambiarFormato(fecha_inicio),
      fin_publicacion: this.cambiarFormato(fecha_fin)
    }
    console.log(body)

    //enviando los datos
    this.mService.setAprove(body).subscribe((data)=>{
      console.log(data)
      if(data.mensaje == 'actualización de estado exitosamente'){
        alert('Mural actualizado con éxito')
        window.location.reload();
      }
    })

  }



  onEdit(){
    alert('Editando... pasa id')
    this.router.navigate(['/main/mural'])
  }

  cambiarFormato(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }


}
