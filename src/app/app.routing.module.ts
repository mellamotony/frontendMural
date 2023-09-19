import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { DesignerGuard } from './guards/DesignerGuard.guard';
import { EditorGuard } from './guards/Editor.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {
    path:"auth",
    loadChildren: ()=> import('./auth/auth.module').then(m => m.AuthModule)
  },

  {
    path:"admin",
    loadChildren: ()=> import('./admin/admin.module').then(m => m.AdminModule),
    canActivate:[AdminGuard]
  },


  {
    path:"main",
    loadChildren: () => import('./main/main.module').then((m)=>m.MainModule),
    canActivate:[DesignerGuard]

  },

  {
    path:'editormain',
    loadChildren: () => import('./editor-main/editor-main.module').then(m => m.EditorMainModule),
    canActivate:[EditorGuard]
  },

  {
    path:"**",
    redirectTo:"auth"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
