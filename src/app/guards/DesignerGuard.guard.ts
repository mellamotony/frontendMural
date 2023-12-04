import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { guardToken } from '../auth/interfaces/login.inteface';



@Injectable({providedIn: 'root'})
export class DesignerGuard implements CanActivate {
  constructor(private route:Router) { }

  canActivate():boolean {

    if(!localStorage.getItem('token')){
      this.route.navigate(['/auth']);
      return false;
    }
    const rolSincoded = localStorage.getItem('token');
    const token:guardToken = jwt_decode(rolSincoded!)

  if(token.rol == 'diseñador'){
    return true;
  }else{
    this.route.navigate(['/auth/login']);
    return false;
  }


  }
}
