import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  constructor(private contactService:ContactService,private snackBar:MatSnackBar){}
  
  onSubmit(form:NgForm){
    if(form.valid){
      this.contactService.sendMail(form.value.name,form.value.email,form.value.number,form.value.message);
    }
    else{
      this.snackBar.open("Please fill all the fields Correctly",'Close',{duration:3000})
    }
    
  }
}
