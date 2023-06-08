import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  items: MenuItem[] = [];
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
        routerLink:'/auth/login'
      },
    ];
  }
}
