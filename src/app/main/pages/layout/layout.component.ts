import { Component, OnInit } from '@angular/core';
import { MenuItem, Message } from 'primeng/api';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  items: MenuItem[] = [];
  messages: Message[] = [{ severity: 'error', summary: 'Error', detail: 'Closable Message Content' }];
  ngOnInit(): void {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-user',
        routerLink:'/main/dashboard'
      },
      {
        label: 'Estado',
        icon: 'pi pi-fw pi-verified',
        routerLink:'/main/estado'
      },
      {
        label: 'Historial',
        icon: 'pi pi-fw pi-book',
        routerLink:'/main/historial'
      },
      {
        separator: true,
      },
      {
        label: 'Quit',
        icon: 'pi pi-fw pi-power-off',
        routerLink:'/auth/login',
        command: () => {
          this.closeSession();
        }

      },
    ];
  }

  closeSession(){
    //borra los datos en el localStorga
    //borra los datos en el //borra lga

    localStorage['removeItem']('token');
    console.log('sesion cerrada')
  }
}
