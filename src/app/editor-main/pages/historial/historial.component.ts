import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HistorialMural } from '../../interfaces/solicitudes.interface';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent {
  public products: HistorialMural[] = [
    {
      nombre_mural: 'Mural1',
      fecha_aprobado: '20/06/2023',

    },
    {
      nombre_mural: 'Mural2',
      fecha_aprobado: '21/06/2023',

    },
    {
      nombre_mural: 'Mural3',
      fecha_aprobado: '22/06/2023',

    },
  ];

  constructor(private route:Router){}

  onVer(){
    this.route.navigate(['/main/mural'])
  }

  onDelete(){
    alert('Borrando..')
  }
}
