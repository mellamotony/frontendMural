import jwt_decode from 'jwt-decode';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { guardToken } from '../interfaces/login.inteface';
// import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
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
        alert('usuario o contraseña incorrectos');
        this.body.reset();
        return;
      }
      console.log('data',data)
      console.log('logeado con exito',data.token)

      const id_user:string | undefined = data.id_user?.toString()

      const token:string | undefined = data.token?.toString()

      localStorage.setItem("token",token!);
      localStorage.setItem("id_user",id_user!)
      const rolEncrypted = localStorage.getItem('token');

      const rolDesencrypted:guardToken = jwt_decode(rolEncrypted!)

      if(rolDesencrypted.rol == 'diseñador'){
        this.router.navigate(['/main']);
      }else if(rolDesencrypted.rol == 'editor'){
        this.router.navigate(['/editormain'])
      }




    });




  }
}
