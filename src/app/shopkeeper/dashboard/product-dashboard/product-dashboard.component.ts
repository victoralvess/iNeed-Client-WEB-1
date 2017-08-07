import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2/database';
import { ProductsService } from './services/products.service';
import { Router } from '@angular/router';

import * as firebase from 'firebase';
import 'rxjs/add/operator/map';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-product-dashboard',
  templateUrl: './product-dashboard.component.html',
  styleUrls: ['./product-dashboard.component.css']
})
export class ProductDashboardComponent implements OnInit {

	stores : any[];
	products : FirebaseListObservable<any[]>;
	user : firebase.User;
  query : any;
  currentPage = 1;

  public paginationComponentConfig: PaginationInstance = {
    id: 'products-pagination',
    itemsPerPage: 10,
    currentPage: 1
  };

  constructor(private router : Router, private productsService : ProductsService) { 
    productsService.getUser().subscribe((user) => {
      this.stores = user.worksAt;
      this.products = this.productsService.getProductsFrom(this.stores[0]);
    });
  }

  ngOnInit() {
  }

  onChange(value) {
  	this.products = this.productsService.getProductsFrom(value);
  }

  addNewProduct() {
    this.router.navigate(['/shopkeeper/dashboard/admin/products/add']);
  }

}