import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { EditorService } from '../../services/editor-services';

@Component({
  selector: 'app-layout-e',
  templateUrl: './layout-e.component.html',
  styleUrls: ['./layout-e.component.css']
})
export class LayoutEComponent implements OnInit {
  items: MenuItem[] = [];
  avatar: string ='';
  nombre: string = '';
  apellidos: string = '';

  constructor(private ms:EditorService){}
  ngOnInit(): void {
    this.items = [
      {
        label: 'Solicitudes',
        icon: 'pi pi-fw pi-user',
        routerLink: '/editormain/solicitudes'
      },
      {
        label: 'Historial',
        icon: 'pi pi-fw pi-book',
        routerLink: '/editormain/historial'
      },
      {
        separator: true,
      },
      {
        label: 'Quit',
        icon: 'pi pi-fw pi-power-off',
        routerLink: '/auth/login',
        command: () => {

          localStorage['removeItem']('token');
          console.log('Sesion finalizada');
        }
      },
    ];

    //obtenemos el token para cambiar el logo
    const id_user = Number(localStorage.getItem('id_user'));
    //se desencripta el token para obtener los datos necesarios para la validación de rutas

    console.log(id_user);
    this.ms.postIdUSER(id_user).subscribe((data) => {
      console.log(data)
      this.avatar = data.nombre[0]
      this.nombre = data.nombre
      this.apellidos = data.apellidos
    })

  }

}
