import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {  Solicitud } from '../../interfaces/mural.interfaces';
import { MuralService } from '../../services/main.services';

@Component({
  selector: 'app-estado',
  templateUrl: './estado.component.html',
  styleUrls: ['./estado.component.css']
})
export class EstadoComponent {


  public listName:Solicitud[] = []


  constructor(
    private router:Router,
    private mService: MuralService) {}
  ngOnInit(): void {
    const idUser = localStorage.getItem('id_user')

    this.mService.postIdsolicitud(parseInt(idUser!)).subscribe((datas) =>{

      datas.forEach((data)=>{
        this.listName.push(data)
      })

    });

  }



}
