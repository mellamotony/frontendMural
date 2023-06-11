import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SolicituMural } from '../../interfaces/solicitudes.interface';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css'],
})
export class SolicitudesComponent implements OnInit {
  public products: SolicituMural[] = [
    {
      nombre_mural: 'Mural1',
      fecha: '20/06/2023',
      estado: 'en espera',
    },
    {
      nombre_mural: 'Mural2',
      fecha: '21/06/2023',
      estado: 'en espera',
    },
    {
      nombre_mural: 'Mural3',
      fecha: '22/06/2023',
      estado: 'en espera',
    },
  ];
  constructor(private router:Router){}

  ngOnInit() {

  }


  onDelete(){
    alert('Eliminando...')
  }
  onPublic(){
    alert('Publicando...')
  }
  onEdit(){
    alert('Editando... pasa id')
    this.router.navigate(['/main/mural'])
  }
}
