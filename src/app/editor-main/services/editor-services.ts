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

  getSolicitudes(): Observable<Solicitud[]> {
    const httOptions = {
      headers: new HttpHeaders({
        'ngrok-skip-browser-warning': 'true'
      })
    }
    return this.http.get<Solicitud[]>(this.url + '/mural/solicitudes', httOptions)
  }

  getResponse(): Observable<Solicitud[]> {
    const httOptions = {
      headers: new HttpHeaders({
        'ngrok-skip-browser-warning': 'true'
      })
    }
    return this.http.get<Solicitud[]>(this.url + '/mural/respuestas', httOptions)
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
