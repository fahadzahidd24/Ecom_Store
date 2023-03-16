import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isLoading =false;
  totalProducts = 0;
  productsPerPage = 9;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  products:Product[] = []
  // searchedProducts:Product[] = []
  private productSub:Subscription
  // private searchedProductSub:Subscription
  constructor( private productService:ProductsService ) { }

  ngOnInit(): void {
  
    this.productService.getProducts(this.productsPerPage,this.currentPage);
    this.isLoading = true;
     this.productSub = this.productService.getProductListener().subscribe((productsData:{products:Product[],productCount:number})=>{
      this.isLoading = false;
      this.totalProducts = productsData.productCount;
      this.products = productsData.products;
    })
  }
  onChangePage(page:PageEvent){
    this.currentPage = page.pageIndex + 1;
    this.productsPerPage = page.pageSize;
    this.productService.getProducts(this.productsPerPage,this.currentPage);
  }

  onSearch(form:NgForm){
    const searchValue = form.value.search;
    console.log(searchValue)
    this.isLoading = true;
    if(searchValue===''){
      this.productService.getProducts(this.productsPerPage,this.currentPage);
    }
    else{
      this.productService.searchProducts(searchValue);
    }
  }

  ngOnDestroy(){
    this.productSub.unsubscribe();
  }

}
