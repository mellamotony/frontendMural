import { Component } from '@angular/core';

@Component({
  selector: 'app-estado',
  templateUrl: './estado.component.html',
  styleUrls: ['./estado.component.css']
})
export class EstadoComponent {
  public product = [
    {nombre:'mural1',fecha:'20/05/2023',estado:'en espera'}
    ,{nombre:'mural2',fecha:'20/05/2023',estado:'aprobado'}
    ,{nombre:'mural3',fecha:'20/05/2023',estado:'rechazado'}
  ]

}
