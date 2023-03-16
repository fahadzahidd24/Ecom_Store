import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private otp:number;
  message:string;
  private token:string;
  private isAuthenticated = false;
  // private tokenTimer:NodeJS.Timer;
  private tokenTimer:any;
  private authStatusListener = new Subject<{message:string,status:boolean}>();
  private otpListener = new Subject<number>();

  constructor(private http: HttpClient,private router:Router,private cookieService:CookieService,private snackBar:MatSnackBar) { }

  getToken(){
    return this.token;
  }
  getOtp(){
    return this.otp;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }
  getOtpListener(){
    return this.otpListener.asObservable();
  }

  createOtp(email:string){
    this.otp = Math.floor(100000 + Math.random() * 900000);
    console.log("creating otp")
    console.log("otp created")
    this.otpListener.next(this.otp);
  }

  createUser(name: string, email: string, phone: number, password: string) {
    const user: User = { name: name, email: email, phone: phone, password: password };
    this.http.post<{ message: string, result: User }>("http://localhost:3000/api/user/signup", user)
      .subscribe(response => {
        console.log(response);
        this.message = "User Created Successfully";
        this.snackBar.open(this.message,"Close",{duration:2000,panelClass: ['bg-dark', 'text-light']})
        this.router.navigate(['/login'])
      },(error)=>{
        this.message = "User Already Exists";
        
        this.snackBar.open(this.message,"Close",{duration:2000,panelClass: ['bg-dark', 'text-light']})
        });
  }
   
  loginUser(email: string, password: string) {
    const user: User = {  email: email, password: password };
    this.http.post<{message:string,token:string,expiresIn:number}>("http://localhost:3000/api/user/login", user)
      .subscribe(response => {
        this.message = "Logged In Successfully";
        this.snackBar.open(this.message,"Close",{duration:2000,panelClass: ['bg-dark', 'text-light']})
        const tokenExpirationDuration = response.expiresIn;
        // this.tokenTimer = setTimeout(()=>{
        //   this.logoutUser();
        // },tokenExpirationDuration * 1000)
        this.setAuthTimer(tokenExpirationDuration);
        console.log(response);
        console.log(response.token);
        const token = response.token;
        this.token = token;
        this.isAuthenticated = true;
        const now = new Date();
        const expirationData = new Date(now.getTime() + tokenExpirationDuration * 1000);
        this.saveAuthData(token,expirationData);
        this.authStatusListener.next({message:this.message,status:true});
        this.router.navigate(['/admin']);
      });
  }

  logoutUser(){
    this.message = "Logged Out Successfully"
    this.snackBar.open(this.message,"Close",{duration:2000,panelClass: ['bg-dark', 'text-light']})
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next({message:this.message,status:false});
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/login']);
  }

  
  autoAuthData(){
    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    const isInFuture = authInformation.expirationDate > now;
    if(isInFuture){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      const expiresInDuration = authInformation.expirationDate.getTime() - now.getTime();
      this.setAuthTimer(expiresInDuration / 1000);
      this.authStatusListener.next({message:"Logged in Successfully",status:true});
    }  
  }
  
  private setAuthTimer(duration:number){
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(()=>{
      this.logoutUser();
    },duration * 1000)
  }


  private saveAuthData(token:string,expirationDate:Date){
    localStorage.setItem('token',token);
    localStorage.setItem('expiration',expirationDate.toISOString());
    this.cookieService.set('token',token);
    this.cookieService.set('expiration',expirationDate.toISOString());
  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    this.cookieService.delete('token');
    this.cookieService.delete('expiration');
  }

  private getAuthData(){
    const token = localStorage.getItem('token');
    const tokenCookie = this.cookieService.get('token');
    const expirationDate = localStorage.getItem('expiration');
    const expirationDateCookie = this.cookieService.get('expiration');
    if(!token || !expirationDate){
      return null;
    }
    return {
      token:tokenCookie,
      expirationDate:new Date(expirationDateCookie)
    }
  }


}
