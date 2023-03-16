import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.css']
})
export class SingupComponent {
  constructor(private authService: AuthService, private snackBar: MatSnackBar) { }

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
        this.authService.createUser(form.value.name, form.value.email, form.value.phone, form.value.password);
      }
    }

  }
}
