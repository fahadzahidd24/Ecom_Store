import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-admin-controlpage',
  templateUrl: './admin-controlpage.component.html',
  styleUrls: ['./admin-controlpage.component.css']
})
export class AdminControlpageComponent {
  totalProducts = 0;
  productsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  addProduct = false
  mode: string = 'create';
  private productId: string;
  product: Product;
  products: Product[] = []
  isLoading = false;
  isFormLoading = false;
  private productSub: Subscription

  constructor(private productService: ProductsService, private router: Router, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.productService.getEditListener().subscribe((productId: string) => {
      if (productId) {
        this.mode = 'edit';
        this.productId = productId;
        this.isFormLoading = true;
        this.productService.getProduct(this.productId).subscribe((product) => {
          this.isFormLoading = false;
          this.product = { id: product._id, name: product.name, description: product.description, price: product.price, image: product.image }
        })
        console.log(this.mode)
      }
      else {
        this.mode = 'create';
        this.productId = null;
      }
    })
    this.isLoading = true;
    this.productService.getProducts(this.productsPerPage, this.currentPage);
    this.getAllProducts();
  }

  getAllProducts(){
    this.productSub = this.productService.getProductListener().subscribe((productsData: { products: Product[], productCount: number }) => {
      this.isLoading = false;
      this.totalProducts = productsData.productCount
      this.products = productsData.products;
      console.log("ll",this.products)
    })
  }

  ngOnDestroy() {
    this.productSub.unsubscribe();
  }
  onRemoveItem(productId: string) {
    this.productService.deleteProduct(productId);
  }
  onAddProduct() {
    this.addProduct = !this.addProduct;
  }
  onEditProduct(productId: string) {
    this.productService.editProduct(productId);
    this.addProduct = !this.addProduct;
  }
  onAddProductSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode == 'create') {
      this.productService.addProduct(form.value.name, form.value.description, form.value.price, form.value.image);
      // this.router.navigate(['/home'])
    }
    else {
      console.log(this.productId, form.value.name, form.value.description, form.value.price, form.value.image)
      this.productService.updateProduct(this.productId, form.value.name, form.value.description, form.value.price, form.value.image)
    }
    form.reset();
  }
  onChangePage(page: PageEvent) {
    this.isLoading = true;
    this.currentPage = page.pageIndex + 1;
    this.productsPerPage = page.pageSize;
    this.productService.getProducts(this.productsPerPage, this.currentPage);
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
}
