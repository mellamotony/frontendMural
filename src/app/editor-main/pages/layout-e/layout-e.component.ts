import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-layout-e',
  templateUrl: './layout-e.component.html',
  styleUrls: ['./layout-e.component.css']
})
export class LayoutEComponent implements OnInit {
  items: MenuItem[] = [];
  ngOnInit(): void {
    this.items = [
      {
        label: 'Solicitudes',
        icon: 'pi pi-fw pi-user',
        routerLink:'/editormain/solicitudes'
      },
      {
        label: 'Historial',
        icon: 'pi pi-fw pi-book',
        routerLink:'/editormain/historial'
      },
      {
        separator: true,
      },
      {
        label: 'Quit',
        icon: 'pi pi-fw pi-power-off',
        routerLink:'/auth/login',
        command: ()=>{

          localStorage['removeItem']('token');
          console.log('Sesion finalizada');
        }
      },
    ];
  }

}
