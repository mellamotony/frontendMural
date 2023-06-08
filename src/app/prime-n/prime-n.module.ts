import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SlideMenuModule } from 'primeng/slidemenu';
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';

@NgModule({
  exports:[
    ButtonModule,
    InputTextModule,
    PasswordModule,
    SlideMenuModule,
    MenubarModule,
    TableModule
  ]
})
export class PrimeNModule { }
