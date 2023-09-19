import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MuralService } from '../../services/main.services';
import { logs } from '../../interfaces/mural.interfaces';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {
  public product: logs[] = [

  ]
  public isactive: boolean = true;

  constructor(
    private router: Router,
    private ms: MuralService
  ) { }
  ngOnInit(): void {
    const id_user = Number(localStorage.getItem('id_user'));
    this.ms.historial(id_user).subscribe((data) => {
      if (data) {
        this.isactive = false;
        console.log(data)
        if (!data) {
          alert('No hay datos')
          return
        }
        data.forEach((e: logs) => {
          const obj: logs = {
            fecha_modificacion: e.fecha_modificacion,
            modificado: e.modificado,
            nombre_mural: e.nombre_mural
          }
          this.product.push(obj)
        });

        this.product.sort((a, b) => {
          return new Date(b.fecha_modificacion).getTime() - new Date(a.fecha_modificacion).getTime();
        })
      }
    })
  }

  redirigir() {
    this.router.navigate(['/main/mural'])

  }

}
