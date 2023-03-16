import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent {
  products: Product[] = [];
  items: number;
  total: number;
  productListenerSubs: Subscription;
  itemsListenerSubs: Subscription;
  constructor(private cartService: CartService) { }
  ngOnInit() {

    this.products = this.cartService.getProducts();
    this.items = this.cartService.getItems();
    this.total = this.cartService.getTotal();


    this.productListenerSubs = this.cartService.getProductsListener().subscribe(product => {
      this.products = product.product;
      this.total = product.price;

    })

    this.itemsListenerSubs = this.cartService.getItemsListener().subscribe(items => {
      this.items = items;
    })

  }
  ngOnDestroy() {
    this.itemsListenerSubs.unsubscribe();
    this.productListenerSubs.unsubscribe();
  }

  onRemoveIem(product: Product) {
    this.cartService.removeProduct(product);
  }
  onReduceQuantity(product: Product) {
    this.cartService.reduceQuantity(product);
  }
  onIncreaseQuantity(product: Product) {
    this.cartService.increaseQuantity(product);
  }
  

}
