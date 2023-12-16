import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { MenuItem, Message } from 'primeng/api';
import { adminService } from '../../services/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { listUser } from '../../interfaces/admin.interfaces';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.css'],
})
export class ListadoUsuariosComponent {
  //lista de usuarios variable

  public users: listUser[] = [];
  public usersCopy: listUser[] = [];
  public admindata!: listUser;
  public avatar: string = '';
  messages: Message[] = [
    {
      severity: 'success',
      summary: 'Success',
      detail: 'Usuario creado con éxito',
    },
  ];
  exito: boolean = false;
  spinner: boolean = true;
  items: MenuItem[] = [];
  showUserForm: boolean = false;
  showEditForm: boolean = false;
  formsUser: FormGroup = this.fb.group({
    nombre: this.fb.control('', [Validators.required]),
    contrasenia: this.fb.control(''),
    apellido_p: this.fb.control('', [Validators.required]),
    apellido_m: this.fb.control('', [Validators.required]),
    correo: this.fb.control('', [Validators.required]),
    id_rol: this.fb.control(0, [Validators.required]),
    id_user: this.fb.control(0),
  });
  //formulario para filtro
  public formFiltro: FormGroup = this.fb.group({
    opcion: this.fb.control(''),
  });
  coloRandom: string = '';
  colors: string[] = [
    '#000000',
    '#00008B',
    '#FF0000',
    '#008000',
    '#800080',
    '#A9A9A9',
    '#FFFF00',
    '#FFA500',
    '#00CED1',
    '#FF69B4',
  ];

  constructor(private admService: adminService, private fb: FormBuilder) {}
  ngOnInit() {
    const idRadom = Math.floor(Math.random() * this.colors.length);

    this.coloRandom = this.colors[idRadom];

    this.admService.getUsers().subscribe((dato) => {
      dato.forEach((data) => {
        if (!data) {
          this.exito = true;
          setTimeout(() => {
            this.exito = false;
          }, 2000);
        }
        this.spinner = false;
        const user = {
          id_user: data.id_user,
          nombre: data.nombre,
          apellidos: data.apellidos,
          correo: data.correo,
          rol: data.rol,
        };
        if (data.rol == 'admin') {
          this.admindata = user;
          this.avatar = user.nombre[0];
        }

        this.users.push(user);
        this.usersCopy.push(user);
        this.users.sort();
        this.usersCopy.sort();
      });

      this.users = this.users.sort((x, y) => {
        const idUsuarioA = parseInt(x.id_user);
        const idUsuarioB = parseInt(y.id_user);

        if (idUsuarioA < idUsuarioB) {
          return -1; // usuarioA debe estar antes que usuarioB
        } else if (idUsuarioA > idUsuarioB) {
          return 1; // usuarioA debe estar después que usuarioB
        } else {
          return 0; // son iguales, no se cambia su orden relativo
        }
      });
    });
  }

  crearNuevoUsuario() {
    const usuarios = {
      nombre: this.formsUser.controls['nombre'].value,
      apellido_p: this.formsUser.controls['apellido_p'].value,
      apellido_m: this.formsUser.controls['apellido_m'].value,
      contrasenia: this.formsUser.controls['contrasenia'].value,
      email: this.formsUser.controls['correo'].value,
      id_rol: this.formsUser.controls['id_rol'].value,
    };

    //servicio que envia

    this.spinner = !this.spinner;
    this.admService.insertUser(usuarios).subscribe((data) => {
      if (data) {
        setTimeout(() => {
          this.spinner = !this.spinner;
        }, 2000);
        //mensaje
        this.exito = !this.exito;

        this.formsUser.reset();
        window.location.reload();
      }
    });
  }

  editarUsuario(e: Event) {
    const parent = e.target as HTMLElement;

    const id_user: number = Number(parent.parentElement?.id);
    this.admService.postIdUSER(id_user).subscribe((data) => {
      const apelldos: string = data.apellidos.split(' ');
      const apellido_p: string = apelldos[0];
      const apellido_m: string = apelldos[1];

      this.showEditForm = !this.showEditForm;
      this.formsUser.controls['id_user'].setValue(id_user);
      this.formsUser.controls['nombre'].setValue(data.nombre);
      this.formsUser.controls['apellido_p'].setValue(apellido_p);
      this.formsUser.controls['apellido_m'].setValue(apellido_m);
      this.formsUser.controls['correo'].setValue(data.correo);
      this.formsUser.controls['id_rol'].setValue(data.id_rol);
    });
  }

  //editar usuario ,, obtiene los datos del formulario y se guarda en la base de datos
  editNUevoUser() {
    const usuarios = {
      id_user: this.formsUser.controls['id_user'].value,
      nombre: this.formsUser.controls['nombre'].value,
      apellido_p: this.formsUser.controls['apellido_p'].value,
      apellido_m: this.formsUser.controls['apellido_m'].value,
      contrasenia:
        this.formsUser.controls['contrasenia'].value !== undefined
          ? this.formsUser.controls['contrasenia'].value
          : undefined,
      correo: this.formsUser.controls['correo'].value,
      id_rol: this.formsUser.controls['id_rol'].value,
    };

    if (this.formsUser.invalid) {
      this.exito = !this.exito;
      this.messages[0].severity = 'error';
      this.messages[0].summary = 'Error';
      this.messages[0].detail = 'Todos los campos son necesarios';
      setTimeout(() => {
        this.exito = !this.exito;
      }, 2000);

      return;
    }
    this.admService.editUser(usuarios).subscribe((data) => {
      //mensaje
      this.exito = !this.exito;

      this.messages[0].detail = data.mensaje;

      setTimeout(() => {
        this.exito = !this.exito;
      }, 2000);
      this.formsUser.reset();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  }

  toggleForm() {
    this.showUserForm = !this.showUserForm;

    this.formsUser.reset();
  }
  toggleditform() {
    this.showEditForm = !this.showEditForm;
    this.formsUser.reset();
  }

  eliminarUsuario(e: Event) {
    const parent = e.target as HTMLElement;

    const id_user: number = Number(parent.parentElement?.id);
    this.admService.deleteUser(id_user).subscribe((data) => {
      //mensaje
      this.exito = !this.exito;

      this.messages[0].detail = data.mensaje;

      setTimeout(() => {
        this.exito = !this.exito;
      }, 2000);
      window.location.reload();
    });
  }

  //cerrar sesion
  closeSession() {
    //borra los datos en el localStorga
    //borra los datos en el //borra lga

    localStorage['removeItem']('token');
  }

  filtro() {
    const valor = this.formFiltro.get('opcion')?.value;
    console.log(valor);
    if (valor == 'inactivo') {
      this.users = this.usersCopy.filter((user) => user.rol == 'inactivo');
      this.users.sort();
    } else if (valor == 'diseñador') {
      this.users = this.usersCopy.filter((user) => user.rol == 'diseñador');
      this.users.sort();
    } else if (valor == 'editor') {
      this.users = this.usersCopy.filter((user) => user.rol == 'editor');
      this.users.sort();
    } else if (valor == 'all') {
      this.users = this.usersCopy;
      this.users.sort();
    }
  }
}
