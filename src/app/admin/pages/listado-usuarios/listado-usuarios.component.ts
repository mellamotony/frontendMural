import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.css']
})
export class ListadoUsuariosComponent {

  items: MenuItem[] = [];
  showUserForm: boolean = false;



  ngOnInit() {
    this.items = [
    ]
  }


  public users: any[] = [{ id: 1, nombre: "Ricky Español", correo: "rickyespañol@esta.com", rol: "Editor" }]

  crearNuevoUsuario() { }

  editarUsuario() { }

  toggleForm() {
    this.showUserForm = !this.showUserForm;
    console.log(this.showUserForm);
  }



  eliminarUsuario() {
  }

}
