import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { listUser } from '../interfaces/admin.interfaces';

@Injectable({providedIn: 'root'})
export class adminService {
  private url:string = '/api'
  constructor(private http:HttpClient) { }


  getUsers():Observable<listUser []>{
    const httOptions = {
      headers: new HttpHeaders({
        'ngrok-skip-browser-warning': 'true'
      })
    }
    return this.http.get<listUser []>(this.url+'/mural/getUsers',httOptions)
  }

  //servicio para enviar el id_user para obtener la info del usuario
  postIdUSER(id:number):Observable<any>{
    const body = {
      "id_user" : id
    }
    return this.http.post<any>(this.url+'/mural/getUserbyId',body)
  }

  //servicio para crear usuarios
  insertUser(body:any):Observable<any>{

    return this.http.post<any>(this.url+'/mural/insertUser',body)
  }

  //servicio para editar usuario
  editUser(body:any):Observable<any>{

    return this.http.patch<any>(this.url+'/mural/updateUser',body)
  }

  //servicio para eliminar user
  deleteUser(id:number):Observable<any>{
    const body = {
      "id_user" : id
    }
    console.log(body)
    return this.http.patch<any>(this.url+'/mural/deleteUser',body)
  }

}
