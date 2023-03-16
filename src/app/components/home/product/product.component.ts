import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  products:Product[] = []
  private productSub:Subscription
  constructor( private productService:ProductsService,private cartService:CartService ) { }

  ngOnInit(): void {
     this.productSub = this.productService.getProductListener().subscribe((productsData:{products:Product[],productCount:number})=>{
      this.products = productsData.products;
      console.log(this.products)
    })
  }

  ngOnDestroy(){
    this.productSub.unsubscribe();
  }

  onAddToCart(product:Product){
    this.cartService.addToCart(product);
  }
}
