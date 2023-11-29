import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem, Message } from 'primeng/api';
import { guardToken } from 'src/app/auth/interfaces/login.inteface';
import { MuralService } from '../../services/main.services';
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  @ViewChild('menu', { static: false }) Menu!: ElementRef<HTMLElement>
  isBlock = false;

  items: MenuItem[] = [];
  messages: Message[] = [{ severity: 'error', summary: 'Error', detail: 'Closable Message Content' }];
  //variables que almacenan la info del usuario
  public avatar:string = ''
  public nombre:string = ''
  public apellidos:string = ''
  coloRandom: string = '';
  colors: string [] = ['red','white','blue','yellow'];

  constructor(

    private ms: MuralService,
    private rt: Router
  ) { }
  ngOnInit(): void {
    const idRadom = Math.floor(Math.random() * this.colors.length)

    this.coloRandom = this.colors[idRadom]
    console.log('color: '+this.coloRandom)
    this.items = [
      {
        label: 'Galeria',
        icon: 'pi pi-fw pi-user',
        routerLink:'/main/dashboard'
      },
      {
        label: 'Estado',
        icon: 'pi pi-fw pi-verified',
        routerLink:'/main/estado'
      },
      {
        label: 'Historial de modificación',
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
//obtenemos el token para cambiar el logo
const id_user = Number(localStorage.getItem('id_user'));
//se desencripta el token para obtener los datos necesarios para la validación de rutas

console.log(id_user);
this.ms.postIdUSER(id_user).subscribe((data)=>{
  console.log(data)
  this.avatar = data.nombre[0]
  this.nombre = data.nombre
  this.apellidos = data.apellidos
})

  }

  isLinkActive(routerLink: string): boolean {
    return this.rt.isActive(routerLink, true);
  }

  closeSession(){
    //borra los datos en el localStorga
    //borra los datos en el //borra lga

    localStorage['removeItem']('token');
    console.log('sesion cerrada')
  }

  hiddenmenu(){

    if (this.isBlock) {
      this.Menu.nativeElement.classList.remove('block');
      this.Menu.nativeElement.classList.add('active');
    } else {
      this.Menu.nativeElement.classList.remove('active');
      this.Menu.nativeElement.classList.add('block');
    }
    this.isBlock = !this.isBlock; // Alternar el estado

  }
}
function jwt_decode(arg0: string): guardToken {
  throw new Error('Function not implemented.');
}

