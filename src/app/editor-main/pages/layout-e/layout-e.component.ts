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
  public rol:string = ''
  colors:string[] = ['#000000',
  '#00008B',
  '#FF0000',
  '#008000',
  '#800080',
  '#A9A9A9',
  '#FFFF00',
  '#FFA500',
  '#00CED1',
  '#FF69B4']
  coloRandom:string=''
  constructor(private ms:EditorService){}
  ngOnInit(): void {
    const idRadom = Math.floor(Math.random() * this.colors.length)
    this.rol = localStorage.getItem('rol')!
    this.coloRandom = this.colors[idRadom]

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
          ;
        }
      },
    ];

    //obtenemos el token para cambiar el logo
    const id_user = Number(localStorage.getItem('id_user'));
    //se desencripta el token para obtener los datos necesarios para la validación de rutas

    ;
    this.ms.postIdUSER(id_user).subscribe((data) => {

      this.avatar = data.nombre[0]
      this.nombre = data.nombre
      this.apellidos = data.apellidos
    })

  }

}
