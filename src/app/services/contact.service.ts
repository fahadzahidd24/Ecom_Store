import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Contact } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient,private snackBar:MatSnackBar) { }

  sendMail(name: string, email: string, phone: number, message: string) {
    const contactData: Contact = { name: name, email: email, phone: phone, message: message }
    this.http.post<{ message: string }>('http://localhost:3000/api/contact/send', contactData).subscribe(res => {
      console.log(res.message)
      this.snackBar.open("Response Received Successfully",'Close',{duration:3000})

    })
  }
  sendOtp(email: string, otp: number) {
    const contactData: Contact = { email: email, otp: otp }
    this.http.post<{ message: string }>('http://localhost:3000/api/contact/otp', contactData).subscribe(res => {
      console.log(res.message)
      // this.snackBar.open("Response Received Successfully",'Close',{duration:3000})
    })
  }
}
