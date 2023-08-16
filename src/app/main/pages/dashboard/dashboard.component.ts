import { Component, OnInit, Output } from '@angular/core';
import { IDmural, MuralByUser } from '../../interfaces/mural.interfaces';
import { MuralService } from '../../services/main.services';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public list = [1, 2, 3];

  public listName:MuralByUser[] = []


  constructor(
    private router:Router,
    private mService: MuralService) {}
  ngOnInit(): void {
    const idUser = localStorage.getItem('id_user')

    this.mService.postIdUser(parseInt(idUser!)).subscribe((data) =>{
      console.log('datos recibidos: ',data)

      data.forEach((item:MuralByUser,i:number ) => {
        const obj = {nombrem:item.nombrem,numeroM:i+1,id_mural:item.id_mural}
        this.listName.push(obj)
      });



    })
  }

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

            repeat= false
            //agrega el id al localStorage para usarlo en la aplicacion
            localStorage.setItem('id_mural', nuevoUUID);
            //reenvia a la ruta donde esta el componente mural
            this.router.navigate(['/main/mural'])
          }
        });
      } else {
        console.log('no hubo datos, entonces es un nuevo mural ');
        const nuevoUUID: string = uuidv4();
         //agrega el id al localStorage para usarlo en la aplicacion
         localStorage.setItem('id_mural', nuevoUUID);
         //reenvia a la ruta donde esta el componente mural
         this.router.navigate(['/main/mural'])
      }
    });
  }
}
