import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({providedIn: 'root'})
export class EditorGuard implements CanActivate {
  constructor(private route:Router) { }

  canActivate():boolean {

    return true;
  }
}
