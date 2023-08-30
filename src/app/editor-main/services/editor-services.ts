import { catchError, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Solicitud } from 'src/app/main/interfaces/mural.interfaces';
import { AprobeMural, RejectMural } from '../interfaces/solicitudes.interface';


@Injectable({providedIn: 'root'})
export class EditorService {


  private url:string = '/api'
  constructor(private http: HttpClient) { }
  //servicio para obtener los id disponibles

    getSolicitudes():Observable<Solicitud[]>{
      return this.http.get<Solicitud[]>(this.url+'/mural/solicitudes')
    }

    //servicio para aprobar/publicar el mural
    setAprove(datos:AprobeMural):Observable<any>{
      return this.http.patch(this.url+'/mural/aprobar',datos)
    }

    //servicio para rechazar mural
    rejectMural(body:RejectMural):Observable<any>{
      return this.http.patch(this.url+'/mural/rechazar',body)
    }



}
