import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  cartItems:number;
  products:Product[] = [];
  quantity:number;
  total:number;
  authListenerSubs: Subscription;
  itemsListenerSubs: Subscription;
  productsListenerSubs: Subscription;
  isLogin = false;
  showMenu = false;

  constructor(private authService: AuthService,private cartService:CartService,private router:Router) { }
  ngOnInit(){
    this.isLogin = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.isLogin = isAuthenticated.status;
    })

    this.itemsListenerSubs = this.cartService.getItemsListener().subscribe(items => {
      this.cartItems = items;
    })
    
    this.productsListenerSubs = this.cartService.getProductsListener().subscribe(product => {
      this.products = product.product;
      this.total = product.price;
      this.quantity = product.quantity;
    })

  }

  onClickOnCart(){
    this.showMenu = !this.showMenu;
  }
  onClearCart(){
    this.cartService.clearCart();
  }
  onGoToCart(){
    this.router.navigate(['/cart']);
  }

  onLogout(){
    this.authService.logoutUser();
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
    this.itemsListenerSubs.unsubscribe();
    this.productsListenerSubs.unsubscribe();
  }
}
