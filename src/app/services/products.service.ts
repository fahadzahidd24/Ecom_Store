import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Subject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  products: Product[] = []
  productsCopy: Product[] = []
  edit: string;
  private productListener = new Subject<{ products: Product[], productCount: number }>();
  private editListener = new Subject<string>();

  constructor(private http: HttpClient,private snackBar:MatSnackBar) { }
  getProducts(pageSize: number, currentPage: number) {
    const queryParam = `?pageSize=${pageSize}&page=${currentPage}`;
    this.http.get<{ message: string, products: any, maxProducts: number }>('http://localhost:3000/api/products' + queryParam)
      .pipe(map((productData) => {
        return {
          products: productData.products.map((product) => {
            return { name: product.name, description: product.description, price: product.price, image: product.image, id: product._id }
          }), maxProducts: productData.maxProducts
        };
      }))
      .subscribe((transformedData) => {
        this.products = transformedData.products;
        this.productListener.next({ products: [...this.products], productCount: transformedData.maxProducts });
      })
  }

  searchProducts(text: string) {
    let words = text.split(' ');
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    let textString = words.join(' ');
    console.log(textString)
    this.http.get<{ message: string, products: any, maxProducts: number }>('http://localhost:3000/api/products/search/' + textString)
      .pipe(map((productData) => {
        return {
          products: productData.products.map((product) => {
            return { name: product.name, description: product.description, price: product.price, image: product.image, id: product._id }
          }), maxProducts: productData.maxProducts
        };
      }))
      .subscribe(res => {
        this.products = res.products;
        // console.log(res.message);
        this.productListener.next({ products: [...this.products], productCount: res.maxProducts })
      })
  }

  getProductListener() {
    return this.productListener.asObservable();
  }
  getEditListener() {
    return this.editListener.asObservable();
  }
  getProduct(productId: string) {
    return this.http.get<{ _id: string, name: string, description: string, price: string, image: string }>('http://localhost:3000/api/products/' + productId);
  }
  editProduct(productId: string) {
    this.edit = productId;
    this.editListener.next(this.edit);
  }
  addProduct(name: string, description: string, price: string, image: string) {
    const product: Product = { id: null, name: name, description: description, price: price, image: image };
    this.http.post<{ message: string }>('http://localhost:3000/api/products', product).subscribe(responseData => {
      const updatedPosts = [...this.products]
      updatedPosts.push(product);
      this.products = updatedPosts;
      this.productListener.next({ products: [...this.products], productCount: this.products.length });
      console.log(responseData.message);
      this.snackBar.open('Product Added Successfully','Close',{ duration: 3000 })
    })
  }
  deleteProduct(productId: string) {
    this.http.delete<{ message: string }>('http://localhost:3000/api/products/' + productId).subscribe(res => {
      console.log(res.message);
      const updatedPosts = this.products.filter(post => post.id !== productId);
      this.products = updatedPosts;
      this.productListener.next({ products: [...this.products], productCount: this.products.length });
      this.snackBar.open('Product Deleted Successfully','Close',{ duration: 3000 })

    })
  }
  updateProduct(productId: string, name: string, description: string, price: string, image: string) {
    const post: Product = { id: productId, name: name, description: description, price: price, image: image }
    this.http.put<{ message: string }>('http://localhost:3000/api/products/' + productId, post).subscribe(responseData => {
      console.log(responseData.message);
      const updatedPosts = [...this.products]
      const oldPostIndex = updatedPosts.findIndex(post => post.id == productId)
      updatedPosts[oldPostIndex] = post;
      this.products = updatedPosts;
      this.productListener.next({ products: [...this.products], productCount: this.products.length });
      this.snackBar.open('Product Updated Successfully','Close',{ duration: 3000 })
      
    })
  }
}
