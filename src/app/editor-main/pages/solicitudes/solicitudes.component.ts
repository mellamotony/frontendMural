import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AprobeMural,
  RejectMural,
  SolicituMural,
} from '../../interfaces/solicitudes.interface';
import { EditorService } from '../../services/editor-services';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css'],
})
export class SolicitudesComponent implements OnInit {
  public products: SolicituMural[] = [];
  public activeMessage: boolean = false;
  public exito:boolean = true;

  public e?: HTMLElement;
  date: Date[] = [
    new Date(),            // Fecha actual
    new Date(2023, 8, 15), // 15 de septiembre de 2023
    new Date(2023, 8, 16)  // 16 de septiembre de 2023
  ];
  minDate: Date = new Date();

  maxDate: Date = new Date();
  //formulario para guardar las fechas de inicio y fin con sus respectivas horas
  public dataTime: FormGroup = this.fb.group({
    inicio: this.fb.control(''),
    fin: this.fb.control(''),
    control : this.fb.control(''),
  });
  constructor(
    private router: Router,
    private mService: EditorService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    const idUser = localStorage.getItem('id_user');

    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();

    let day = today.getDate();
    console.log(day);
    let prevDay = day === 1 ? new Date(year, month, 0).getDate() : day - 1;
    console.log(prevDay);
    let prevMonth = month === 0 ? 11 : month - 1;
    let prevYear = prevMonth === 11 ? year - 1 : year;
    let nextMonth = month === 11 ? 0 : month + 1;
    let nextYear = nextMonth === 0 ? year + 1 : year;

    this.minDate.setDate(prevDay + 1);
    this.minDate.setMonth(month);
    this.minDate.setFullYear(prevYear);
    console.log('miniama: ',this.minDate)
    this.maxDate = new Date();
    this.maxDate.setMonth(nextMonth);
    this.maxDate.setFullYear(nextYear);

    //se hace una peticion para obtener las solucitudes que esten en espera
    this.mService.getSolicitudes().subscribe((datas) => {
      datas.forEach((data) => {
        console.log('datos del solicitud:',data)
        const objSoli: SolicituMural = {
          id_mural: data.id_mural,
          nombre_mural: data.nombrem,
          fecha: data.fecha_solicitud,
          estado: data.estado,
          id_user:data.id_user
        };
        this.exito = false
        if (objSoli.estado === 'en espera') {
          this.products.push(objSoli);

        }
      });
    });
  }

  onDelete(el: Event) {
    //obtenemos el padre
    const parentElement = (el.target as HTMLElement).closest('.rowT');
    console.log(parentElement);
    //asignamos el event para obtener unos valores
    this.e = parentElement as HTMLElement;

    //obetenemos la fecha de modificacion actual
    const fecha_actual = new Date();
    const year = fecha_actual.getFullYear();
    const month = (fecha_actual.getMonth() + 1).toString().padStart(2, '0'); // +1 porque los meses comienzan desde 0
    const day = fecha_actual.getDate().toString().padStart(2, '0');
    const hours = fecha_actual.getHours().toString().padStart(2, '0');
    const minutes = fecha_actual.getMinutes().toString().padStart(2, '0');
    const seconds = fecha_actual.getSeconds().toString().padStart(2, '0');

    // Formatear la fecha y hora en el formato deseado
    const fechaRechazado = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    console.log(fechaRechazado)

    const body: RejectMural = {
      id_mural: this.e.id,
      id_user: Number(localStorage.getItem('id_user')),
      estado: 'rechazado',
      fechaRechazado:fechaRechazado
    };
    console.log(body);



    //enviando datos
    this.mService.rejectMural(body).subscribe((data) => {
      console.log(data);
      if (data.mensaje == 'actualización de estado exitosamente') {
        alert('Mural actualizado con éxito');
        window.location.reload();
      }
    });
  }
  onPublic(el: Event) {
    this.activeMessage = !this.activeMessage;

    //obtenemos el padre
    const parentElement = (el.target as HTMLElement).closest('.rowT');
    console.log(parentElement);
    //asignamos el event para obtener unos valores
    this.e = parentElement as HTMLElement;
  }

  enviarInfo() {
    //obtenemos las fechas del formulario y lo convertimos en date
    const fecha_inicio: Date = new Date(this.dataTime.controls['inicio'].value);
    const fecha_fin: Date = new Date(this.dataTime.controls['fin'].value);

    //obetenemos la fecha de modificacion actual
    const fecha_actual = new Date();
    const year = fecha_actual.getFullYear();
    const month = (fecha_actual.getMonth() + 1).toString().padStart(2, '0'); // +1 porque los meses comienzan desde 0
    const day = fecha_actual.getDate().toString().padStart(2, '0');
    const hours = fecha_actual.getHours().toString().padStart(2, '0');
    const minutes = fecha_actual.getMinutes().toString().padStart(2, '0');
    const seconds = fecha_actual.getSeconds().toString().padStart(2, '0');

    // Formatear la fecha y hora en el formato deseado
    const fechaAprobado = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    console.log(fechaAprobado)
    const id_user = this.e?.firstChild as HTMLElement

    const body: AprobeMural = {
      id_mural: this.e!.id,
      id_user:Number(id_user.id),
      estado: 'aprobado',
      fecha_publicacion: this.cambiarFormato(fecha_inicio),
      fin_publicacion: this.cambiarFormato(fecha_fin),
      fechaAprobado:fechaAprobado
    };
    console.log(body);

    //enviando los datos
    // this.mService.setAprove(body).subscribe((data) => {
    //   console.log(data);
    //   if (data.mensaje == 'actualización de estado exitosamente') {
    //     alert('Mural actualizado con éxito');
    //     window.location.reload();
    //   }
    // });
  }

  onEdit() {
    alert('Editando... pasa id');
    this.router.navigate(['/main/mural']);
  }

  cambiarFormato(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
