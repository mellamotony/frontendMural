import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SlideMenuModule } from 'primeng/slidemenu';
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { MegaMenuModule } from 'primeng/megamenu';
import { ColorPickerModule } from 'primeng/colorpicker';
import { MessagesModule } from 'primeng/messages';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  exports:[
    ButtonModule,
    InputTextModule,
    PasswordModule,
    SlideMenuModule,
    MenubarModule,
    TableModule,
    TabMenuModule,
    MegaMenuModule,
    ColorPickerModule,
    MessagesModule,
    CalendarModule
  ]
})
export class PrimeNModule { }
