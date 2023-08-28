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
        this.messages.pop()
        this.messages.push({ severity: 'error', summary: 'Error', detail: 'Usuario o contraseña incorrecto'})
        this.exito = true
        setTimeout(()=>{
          this.exito = false
        },5000)
        this.body.reset();
        return;
      }
      if(this.messages.length >= 0){
        console.log('detalles: '+this.messages[0].detail)
      }


      const condicion = this.messages[0]!.detail

      if( condicion =='Usuario o contraseña incorrecto'){
        this.messages.pop();
        this.messages.push({ severity: 'success', summary: 'Success', detail: 'Logeado con éxito' })
      }
      this.exito = true;
      console.log('estado: ',this.messages);
      const id_user:string | undefined = data.id_user?.toString()

      const token:string | undefined = data.token?.toString()

      localStorage.setItem("token",token!);
      localStorage.setItem("id_user",id_user!)
      const rolEncrypted = localStorage.getItem('token');

      const rolDesencrypted:guardToken = jwt_decode(rolEncrypted!)

      if(rolDesencrypted.rol == 'diseñador'){
        setTimeout(()=>{
          this.router.navigate(['/main']);
        },3000)

      }else if(rolDesencrypted.rol == 'editor'){
        setTimeout(()=>{
          this.router.navigate(['/editormain'])
        },3000)

      }




    });




  }
}
