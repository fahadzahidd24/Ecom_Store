import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  invalid:boolean=false;
  constructor(private authService:AuthService){}

  onLogin(form:NgForm){
    if(form.invalid){
      this.invalid = true;
      return;
    }
    else{
      this.invalid = false;
      console.log(form.value);
      this.authService.loginUser(form.value.email,form.value.password);
    }
  }
  onEye(){
    const password = document.getElementById('password');
    const eye = document.getElementById('eye');
    if(password.getAttribute('type') == 'password'){
      password.setAttribute('type','text');
      eye.classList.remove('fa-eye');
      eye.classList.add('fa-eye-slash');
    }
    else{
      password.setAttribute('type','password');
      eye.classList.remove('fa-eye-slash');
      eye.classList.add('fa-eye');
    }
  }
}
