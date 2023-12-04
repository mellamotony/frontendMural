import { Component, OnInit, Output } from '@angular/core';
import { IDmural, MuralByUser } from '../../interfaces/mural.interfaces';
import { MuralService } from '../../services/main.services';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { environment } from 'src/enviroments/enviroments';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public list = [1, 2, 3];

  public listName: MuralByUser[] = []

  //activar desactivar spinner
  public isactive: boolean = true;
  public isdata: boolean = false;


  constructor(
    private router: Router,
    private mService: MuralService) { }


  cleanPath(inputPath: string): string {
    const url = environment.apiUrl
    // Reemplaza "C:\\wamp64\\www\\codeigniter4-framework-5d3d4b2" con "http" en la cadena de entrada.
    const cleanedPath = inputPath.replace(/C:\\wamp64\\www\\codeigniter4-framework-5d3d4b2/g, url);

    return cleanedPath;
  }
  ngOnInit(): void {
    const idUser = localStorage.getItem('id_user')

    this.mService.postIdUser(parseInt(idUser!)).subscribe((data) => {
      if (data) {
        setTimeout(() => {
          this.isactive = false
        }, 100);
        this.isdata = true;


        data.forEach((item: MuralByUser, i: number) => {
          const obj = { nombrem: item.nombrem, numeroM: i + 1, id_mural: item.id_mural, imgmural:this.cleanPath(item.imgmural!)  }
          this.listName.push(obj)
        });
      }




    })
  }

  generarId() {
    this.mService.getId().subscribe((data) => {


      let repeat: boolean = true;

      if (data.length !== 0) {
        data.forEach((d) => {
          while (repeat) {
            const nuevoUUID: string = uuidv4();
            const { id_mural } = d;
            if (id_mural == nuevoUUID) {
              //Remplazar por un mensaje de notificacion de prime ng

              return
            }

            repeat = false
            //agrega el id al localStorage para usarlo en la aplicacion
            localStorage.setItem('id_mural', nuevoUUID);
            //reenvia a la ruta donde esta el componente mural
            this.router.navigate(['/main/mural'])
          }
        });
      } else {

        const nuevoUUID: string = uuidv4();
        //agrega el id al localStorage para usarlo en la aplicacion
        localStorage.setItem('id_mural', nuevoUUID);
        //reenvia a la ruta donde esta el componente mural
        this.router.navigate(['/main/mural'])
      }
    });
  }
}
