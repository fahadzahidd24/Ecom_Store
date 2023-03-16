import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  authListenerSubs: Subscription;
  isLogin = false;

  constructor(private authService: AuthService) { }
  ngOnInit(){
    this.isLogin = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.isLogin = isAuthenticated.status;
    })
  }

  onLogout(){
    this.authService.logoutUser();
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }
}
