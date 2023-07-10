import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { guardToken } from '../auth/interfaces/login.inteface';



@Injectable({providedIn: 'root'})
export class EditorGuard implements CanActivate {
  constructor(private route:Router) { }

  canActivate():boolean {
    const rolSincoded = localStorage.getItem('token');
    const token:guardToken = jwt_decode(rolSincoded!)
    console.log('guard: ',token.rol);
  if(token.rol == 'editor'){
    return true;
  }else{
    this.route.navigate(['/auth/login']);
    return false;
  }


  }
}
