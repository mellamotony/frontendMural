
import { Observable, catchError,of } from 'rxjs';
import { Injectable } from '@angular/core';

import { Logresponse } from '../interfaces/login.inteface';
import { HttpClient } from '@angular/common/http';



@Injectable({ providedIn: 'root' })
export class LoginService {
  //http://localhost:8098/codeigniter4-framework-5d3d4b2/login'/api/login';'https://apimural.onrender.com/login'
  private url:string = 'https://apimural.onrender.com/login'


  constructor(private http: HttpClient) { }

  EnviarLogin(email:string,password:string):Observable< Logresponse | null>{
    const body = {
      "email":email,
      "contrasenia":password
    }
    return this.http.post(this.url,body).pipe(
      catchError( () => of(null))
    )
  }

}
