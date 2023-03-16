import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  items:number = 0;
  products:Product[] = [];
  totalAmount:number = 0;
  quantity:number = 1;
  itemsListener = new Subject<number>();
  productsListener = new Subject<{product:Product[],price:number, quantity:number}>();
  constructor(private snackBar:MatSnackBar) { }

  getItemsListener(){
    return this.itemsListener.asObservable();
  }
  getProductsListener(){
    return this.productsListener.asObservable();
  }

  getItems(){
    return this.items;
  }
  getProducts(){
    return this.products;
  }
  getTotal(){
    return this.totalAmount;
  }

  addToCart(product:Product){
    this.items++;
    if(this.products.find(p => p.id === product.id)){
      this.products.find(p => p.id === product.id).quantity++;
      this.updateCart(product);
      return;
    }
    else{
      product.quantity = 1;
    }
    this.products.push(product);
    this.updateCart(product);
    this.snackBar.open(`${product.name} added to cart`, 'Close', {
      duration: 2000,
    })
  }
  
  updateCart(product:Product){
    this.totalAmount += +product.price;
    this.itemsListener.next(this.items);
    this.productsListener.next({product:this.products,price:this.totalAmount,quantity:product.quantity});
  }

  reduceQuantity(product:Product){
    this.items--;
    this.totalAmount -= +product.price;
    this.quantity = this.products.filter(p => p.id === product.id).length;
    
    this.products.find(p => p.id === product.id).quantity--;
    this.itemsListener.next(this.items);
    this.productsListener.next({product:this.products,price:this.totalAmount,quantity:product.quantity});
    this.snackBar.open(`${product.name} quantity reduced`, 'Close', {
      duration: 2000,
    })
    if(product.quantity === 0){
      this.removeProduct(product);
    }
  }
  increaseQuantity(product:Product){
    this.items++;
    this.totalAmount += +product.price;
    this.products.find(p => p.id === product.id).quantity++;
    this.itemsListener.next(this.items);
    this.productsListener.next({product:this.products,price:this.totalAmount,quantity:product.quantity});
    this.snackBar.open(`${product.name} quantity increased`, 'Close', {
      duration: 2000,
    })
  }
  clearCart(){
    this.items = 0;
    this.products = [];
    this.totalAmount = 0;
    this.quantity = 0;
    this.itemsListener.next(this.items);
    this.productsListener.next({product:this.products,price:this.totalAmount,quantity:this.quantity});
    this.snackBar.open(`Cart cleared`, 'Close', {
      duration: 2000,
    })
  }

  removeProduct(product:Product){
    this.products = this.products.filter(p => p.id !== product.id);
    this.quantity = this.products.filter(p => p.id === product.id).length;
    this.itemsListener.next(this.items);
    this.productsListener.next({product:this.products,price:this.totalAmount,quantity:this.quantity});
    this.snackBar.open(`${product.name} removed from cart`, 'Close', {
      duration: 2000,
    })
  }

}