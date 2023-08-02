import { catchError, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IDmural, MuralDataSetItem } from '../interfaces/mural.interfaces';

@Injectable({providedIn: 'root'})
export class MuralService {


  private url:string = '/api'
  constructor(private http: HttpClient) { }

  getId():Observable<IDmural[] | []>{
    return this.http.get<IDmural[] | []>(this.url+'/mural/getId').pipe(
      catchError(() => of([]))
    )
  }


  postData(data:MuralDataSetItem): Observable<any>{
    return this.http.post<any>(this.url+'/mural/insert',data)
  }






}
