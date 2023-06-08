import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent {
  public product = [
    {nombre:'mural1',fecha:'20/05/2023'}
    ,{nombre:'mural2',fecha:'20/05/2023'}
    ,{nombre:'mural3',fecha:'20/05/2023'}
  ]

  constructor(private router:Router){}

  redirigir(){
    this.router.navigate(['/main/mural'])

  }

}
