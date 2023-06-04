
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
    // private logService:LoginService,
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

    this.router.navigate(['/main']);
    // this.logService.EnviarLogin(user,contra).subscribe(data => console.log(data));




  }
}
