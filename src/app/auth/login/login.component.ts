import jwt_decode from 'jwt-decode';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { guardToken } from '../interfaces/login.inteface';
import { Message } from 'primeng/api';
// import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  messages: Message[] = [{ severity: 'success', summary: 'Success', detail: 'Logeado con éxito' }]
  exito:boolean = false;
  spinner:boolean = false;

  public body:FormGroup = this.fb.group({
    usuario:this.fb.control('',[Validators.required]),
    contraseña: this.fb.control('',[Validators.required])
  })

  constructor(
    private router:Router,
    private logService:LoginService,
    private fb:FormBuilder){}


  onLogin(e:Event){
    e.preventDefault();
    this.spinner = true;
    if(this.body.invalid){
      alert('Faltan datos')

      return;
    }
    //cuando paso la validacion
    const email = this.body.controls['usuario'].value;
    const password = this.body.controls['contraseña'].value;

    console.log('datos enviados: ',{email,password});


    this.logService.EnviarLogin(email,password).subscribe(data => {
      console.log(data);
      if(!data){
        this.spinner = false;
        this.messages.pop()
        this.messages.push({ severity: 'error', summary: 'Error', detail: 'Usuario o contraseña incorrecto'})
        this.exito = true

        setTimeout(()=>{
          this.exito = false
        },5000)
        this.body.reset();
        return;
      }

      this.spinner = false;




      this.messages.pop();
      this.messages.push({ severity: 'success', summary: 'Success', detail: 'Logeado con éxito' })

      this.exito = true;
      console.log('estado: ',this.messages);
      const id_user:string | undefined = data.id_user?.toString()

      const token:string | undefined = data.token?.toString()

      localStorage.setItem("token",token!);
      localStorage.setItem("id_user",id_user!)
      const rolEncrypted = localStorage.getItem('token');
      //se desencripta el token para obtener los datos necesarios para la validación de rutas
      const rolDesencrypted:guardToken = jwt_decode(rolEncrypted!)

      if(rolDesencrypted.rol == 'diseñador'){
        setTimeout(()=>{
          this.router.navigate(['/main']);
        },3000)

      }else if(rolDesencrypted.rol == 'editor'){
        setTimeout(()=>{
          this.router.navigate(['/editormain'])
        },3000)

      }else if(rolDesencrypted.rol == 'admin'){
        setTimeout(()=>{
          this.router.navigate(['/admin'])
        },3000)

      }




    });




  }
}
