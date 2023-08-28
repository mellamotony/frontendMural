import { catchError, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IDmural, MuralDataSetItem, Solicitud } from '../interfaces/mural.interfaces';

@Injectable({providedIn: 'root'})
export class MuralService {


  private url:string = '/api'
  constructor(private http: HttpClient) { }
  //servicio para obtener los id disponibles
  getId():Observable<IDmural[] | []>{
    return this.http.get<IDmural[] | []>(this.url+'/mural/getId').pipe(
      catchError(() => of([]))
    )
  }

  //guardar el contenido del mural en la base de datos
  postData(data:MuralDataSetItem): Observable<any>{
    return this.http.post<any>(this.url+'/mural/insert',data)
  }

//servicio para enviar el id del usuario y se recibe los datos del mural
postIdUser(id:number):Observable<any>{
  const body = {"id_user": id}
  return this.http.post(this.url+'/mural/dashboard',body)

}

//servicio para enviar el id del mural y recibir sus respectivos datos

postIdmurl(id:string):Observable<MuralDataSetItem []> {
  const body = {"id_mural":id}
  return this.http.post<MuralDataSetItem[]>(this.url+'/mural/edit',body)
}

//servicio para recibir solicituds by usuario
postIdsolicitud(id:number):Observable<Solicitud[]>{
  const body = {
    id_user:id
  }
  return this.http.post<Solicitud[]>(this.url+'/mural/solbyuser',body)
}





}
