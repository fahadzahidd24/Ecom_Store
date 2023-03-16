import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminControlpageComponent } from './components/admin-controlpage/admin-controlpage.component';
import { ContactComponent } from './components/contact/contact.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SingupComponent } from './components/singup/singup.component';
import { AuthGuard } from './Guards/auth.guard';

const routes: Routes = [
  {path:'',redirectTo:'home',pathMatch:'full'},
  {path:"home", component:HomeComponent},
  {path:"login",component:LoginComponent},
  {path:"signup",component:SingupComponent},
  {path:"contact",component:ContactComponent},
  {path:"admin",component:AdminControlpageComponent, canActivate:[AuthGuard]},
  {path:"admin/:productId",component:AdminControlpageComponent, canActivate:[AuthGuard]},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
