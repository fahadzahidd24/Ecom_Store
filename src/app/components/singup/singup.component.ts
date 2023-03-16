import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.css']
})
export class SingupComponent {
  otp:number;
  showOtp:boolean = false;
  otpSub:Subscription;
  constructor(private authService: AuthService, private snackBar: MatSnackBar,private otpService:ContactService) { }

  ngOnInit(){
    
  }
  
  onSignUp(form: NgForm) {
    if (form.invalid) {
      this.snackBar.open("Please fill all the fields Correctly", 'Close', { duration: 3000 })
      return;
    }
    else {
      if (form.value.password != form.value.confirmPassword) {
        this.snackBar.open("Password and Confirm Password should be same", 'Close', { duration: 3000 })
        return;
      }
      else {
        // this.authService.createUser(form.value.name, form.value.email, form.value.phone, form.value.password);
        this.otpSub = this.authService.getOtpListener().subscribe((otp) => {
          console.log("yee")
          this.otp = otp;
          console.log('otp agya', this.otp)
          this.otpService.sendOtp(form.value.email,this.otp);
        })
        this.showOtp = true;
        this.authService.createOtp(form.value.email);
      }
    }
  }
  onSubmitOtp(otp:number,form:NgForm){
    if(otp == this.otp){
      // this.snackBar.open("Account Created Successfully",'Close',{duration:3000})
      this.authService.createUser(form.value.name, form.value.email, form.value.phone, form.value.password);
    }
    else{
      this.snackBar.open("Invalid Otp",'Close',{duration:3000})
    }
  }

  ngOnDestroy(){
    this.otpSub.unsubscribe();
  }
}
