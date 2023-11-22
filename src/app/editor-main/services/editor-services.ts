import { catchError, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Solicitud } from 'src/app/main/interfaces/mural.interfaces';
import { AprobeMural, RejectMural } from '../interfaces/solicitudes.interface';


@Injectable({ providedIn: 'root' })
export class EditorService {


  private url: string = '/api'
  constructor(private http: HttpClient) { }
  //servicio para obtener los id disponibles

  getSolicitudes(id: string): Observable<Solicitud[]> {
    // const httOptions = {
    //   headers: new HttpHeaders({
    //     'ngrok-skip-browser-warning': 'true'
    //   })

    // }
    const body = {
      "id_user":id
    }
    return this.http.post<Solicitud[]>(this.url + '/mural/solbyuser',body)
  }
  //servicio para el historial
  getResponse(id_editor: string): Observable<Solicitud[]> {
    // const httOptions = {
    //   headers: new HttpHeaders({
    //     'ngrok-skip-browser-warning': 'true'
    //   })
    // }
    const body = {
      "id_user":id_editor
    }
    return this.http.post<Solicitud[]>(this.url + '/mural/respuestas', body)
  }
  //servicio para el historial pero da respuesta de rechazados
  getReject(id: string): Observable<Solicitud[]> {
    // const httOptions = {
    //   headers: new HttpHeaders({
    //     'ngrok-skip-browser-warning': 'true'
    //   })
    // }
    const body = {
      "id_user":id
    }
    return this.http.post<Solicitud[]>(this.url + '/mural/respreject', body)
  }


  //servicio para aprobar/publicar el mural
  setAprove(datos: AprobeMural): Observable<any> {
    return this.http.patch(this.url + '/mural/aprobar', datos)
  }

  //servicio para rechazar mural
  rejectMural(body: RejectMural): Observable<any> {
    return this.http.patch(this.url + '/mural/rechazar', body)
  }

  //servicio para enviar el id_user para obtener la info del usuario
  postIdUSER(id: number): Observable<any> {
    const body = {
      "id_user": id
    }
    return this.http.post<any>(this.url + '/mural/getUserbyId', body)
  }



}
