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
        label: 'Mural',
        icon: 'pi pi-fw pi-file',
        routerLink:'/main/mural'
      },
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',

      },
      {
        label: 'Users',
        icon: 'pi pi-fw pi-user',

      },
      {
        label: 'Events',
        icon: 'pi pi-fw pi-calendar',

      },
      {
        separator: true,
      },
      {
        label: 'Quit',
        icon: 'pi pi-fw pi-power-off',
      },
    ];
  }
}
