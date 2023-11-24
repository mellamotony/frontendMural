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
  public isactive:boolean = true;

  constructor(
    private router:Router,
    private mService: MuralService) {}
  ngOnInit(): void {
    const idUser = localStorage.getItem('id_user')

    this.mService.postIdsolicitud(parseInt(idUser!)).subscribe((datas) =>{
      if(datas.length < 1){
        this.isactive = false;
        return;
      }

      datas.forEach((data)=>{
        if(data){
          setTimeout(()=>{
            this.isactive = false;
          },1000)
          this.listName.push(data)
        }else{
          this.isactive = false;
          alert('No hubo datos ')
        }

      })

    });

  }



}
