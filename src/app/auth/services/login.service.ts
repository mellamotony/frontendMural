
// import { Observable, catchError,of } from 'rxjs';
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Logresponse } from '../interfaces/login.inteface';



// @Injectable({ providedIn: 'root' })
// export class LoginService {

//   public url:string = '';


//   constructor(private http: HttpClient) { }

//   EnviarLogin(usuario:string,password:string):Observable< Logresponse| null>{
//     const body = {
//       user:usuario,
//       contra:password
//     }
//     return this.http.post(this.url,body).pipe(
//       catchError(() => of(null))
//     )
//   }

// }
