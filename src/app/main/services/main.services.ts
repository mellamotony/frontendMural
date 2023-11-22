import { catchError, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { editors, IDmural, logs, MuralDataSetItem, Solicitud } from '../interfaces/mural.interfaces';


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
    console.log('ejecutando.........')
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
  console.log(body)
  return this.http.post<Solicitud[]>(this.url+'/mural/getEstado',body)
}

//servicio para actualizar el mural /mural/updateM
updateMural(body:MuralDataSetItem):Observable<any>{
  return this.http.patch<any>(this.url+'/mural/updateM',body)
}

//servicio para mostrar el historial de edición
historial(id_user:number):Observable<logs []>{
  const body = {
    id_user: id_user
  }
  return this.http.post<logs []>(this.url+'/mural/logs',body)
}

 //servicio para enviar el id_user para obtener la info del usuario
 postIdUSER(id:number):Observable<any>{
  const body = {
    "id_user" : id
  }
  return this.http.post<any>(this.url+'/mural/getUserbyId',body)
}

getUsers():Observable<editors [] | []>{
  return this.http.get<editors []>(this.url+"/mural/getUsers").pipe(
    catchError((error) => of([]) )
  )
}


//http://localhost:8098


}
