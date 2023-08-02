import { Component, Output } from '@angular/core';
import { IDmural } from '../../interfaces/mural.interfaces';
import { MuralService } from '../../services/main.services';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  public list: number[] = [1, 2, 3];

  constructor(
    private router:Router,
    private mService: MuralService) {}

  generarId() {
    this.mService.getId().subscribe((data) => {
      console.log(data);

      let repeat: boolean = true;

      if (data.length !== 0) {
        data.forEach((d) => {
          while (repeat) {
            const nuevoUUID: string = uuidv4();
            const { id_mural } = d;
            if (id_mural == nuevoUUID) {
              //Remplazar por un mensaje de notificacion de prime ng
              console.log('ya existe el id');
              return
            }
            console.log(
              'Agregando id al mural lo que quiere decir que es un mural nuevo'
            );
            repeat= false
            //agrega el id al localStorage para usarlo en la aplicacion
            localStorage.setItem('id_mural', nuevoUUID);
            //reenvia a la ruta donde esta el componente mural
            this.router.navigate(['/main/mural'])
          }
        });
      } else {
        console.log('no hubo datos ');


      }
    });
  }
}
