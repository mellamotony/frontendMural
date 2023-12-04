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
  public status:boolean = true;
  public aprobado = 'aprobado'
  public products: SolicituMural[] = [];
  public exitos:boolean = true;
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
    const id_user: string = localStorage.getItem('id_user')!
    this.mService.getResponse(id_user).subscribe((datas) => {

        if(datas.length < 1){
          this.exitos = false;
          return;
        }
      datas.forEach((data) => {

        this.exitos = false

        const objSoli: SolicituMural = {
          id_mural: data.id_mural,
          nombre_mural: data.nombrem,
          fecha: data.fecha_respuesta!,
          estado: data.estado,
          fecha_publicacion:data.fecha_publicacion,
          fin_publicacion:data.fin_publicacion
        };

        // let option =  this.formEstado.controls['option'].value
        //
        this.products = this.products.filter((data)=> data.estado !== 'en espera')
        this.products.push(objSoli);

      });
    });
  }

  onVer(){
    this.route.navigate(['/main/mural'])
  }

  cambiarStatus(){
    const id_user: string = localStorage.getItem('id_user')!
    this.exitos = true

    this.aprobado = this.formEstado.get('option')!.value
    this.formEstado.controls['option'].setValue( this.formEstado.get('option')!.value)
    this.products = []
    //se hace una nueva peticion
    if(this.aprobado == 'aprobado'){
      this.mService.getResponse(id_user).subscribe((datas) => {
        if(datas.length < 1){
          this.exitos = false;
          return;
        }
        datas.forEach((data) => {
          const objSoli: SolicituMural = {
            id_mural: data.id_mural,
            nombre_mural: data.nombrem,
            fecha: data.fecha_respuesta!,
            estado: data.estado,
            fecha_publicacion:data.fecha_publicacion,
            fin_publicacion:data.fin_publicacion
          };
          if(!this.status){
            this.status = true
          }
          this.exitos = false
          let option =  this.formEstado.controls['option'].value

          if (objSoli.estado === option) {

            this.products = this.products.filter((data) => data.estado == option )
            this.products.push(objSoli)
          }
        });

      });
    }else{
      this.mService.getReject(id_user).subscribe((datas)=>{
        if(datas.length < 1){
          this.exitos = false;
          return;
        }
        datas.forEach((data)=>{
          const objsolicitud: SolicituMural = {
            id_mural: data.id_mural,
            nombre_mural: data.nombrem,
            fecha: data.fecha_respuesta!,
            estado: data.estado,
            fecha_publicacion:data.fecha_publicacion,
            fin_publicacion:data.fin_publicacion
          };
          if(this.status){
            this.status = false
          }

          this.exitos = false
          this.products.push(objsolicitud)
        })
      })
    }



  }

  onDelete(){
    alert('Borrando..')
  }
}
