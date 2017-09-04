import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2/database';
import { ProductsService } from './services/products.service';
import { Router } from '@angular/router';

import * as firebase from 'firebase';
import 'rxjs/add/operator/map';
import { PaginationInstance } from 'ngx-pagination';

import { Modal } from 'ngx-modialog/plugins/bootstrap';

import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs';


@Component({
  selector: 'app-products-dashboard',
  templateUrl: './products-dashboard.component.html',
  styleUrls: ['./products-dashboard.component.css']
})
export class ProductsDashboardComponent implements OnInit {

	stores : any[];
	products;
	user : firebase.User;
  query : any;
  currentPage = 1;
  userSubscription;
  productsSubscription;
  lastSelected;
  productsSubject;

  public paginationComponentConfig: PaginationInstance = {
    id: 'products-pagination',
    itemsPerPage: 10,
    currentPage: 1
  };

  constructor(private router : Router, private productsService : ProductsService, private modal : Modal) { 
		this.productsSubject = new Rx.Subject<string>();
		this.productsSubject.asObservable().subscribe((storeId) => {
  		this.getProducts(storeId);
  	});

    this.userSubscription = productsService.getUser().subscribe((user) => {
      this.stores = user.worksAt;
      this.lastSelected = this.stores[0].storeId;      
      this.productsSubject.next(this.lastSelected); 
    });
  } 	

  ngOnInit() { }

  ngOnDestroy() {
    console.log('onDestroy');
    this.products.subscribe().unsubscribe();
    this.userSubscription.unsubscribe();
    this.productsSubscription.unsubscribe();
    
  }  

  onChange(value) {
    this.lastSelected = value;   
    this.productsSubject.next(this.lastSelected);
  }

  getProducts(storeId) {    
    this.products = this.productsService.getProductsFrom(storeId);
    this.updateProductsSubscription();
  }

  updateProductsSubscription() {    
    this.productsSubscription = this.products.subscribe();
  }

  addNewProduct() {
    this.router.navigate(['/shopkeeper/dashboard/admin/products/add']);
  }

  deleteProduct(key, categories, store) {
  	console.log('delete', key);
  	console.log('delete', categories);
  	console.log('delete', store);
    const deleteModal = this.modal.confirm()
                      .size('lg')
                      .showClose(false)
                      .keyboard(27)
                      .title('Excluir dados')
                      .body(`
                          <div class="alert alert-danger">
                            <b><span class="material-icons">warning</span> O produto será excluído (permanentemente).</b>
                          </div>
                          <p>Você realmente deseja excluir este produto?</p>
                          `)
                      .cancelBtn('CANCELAR')
                      .okBtn('EXCLUIR')
                      .okBtnClass('btn btn-danger')
                      .open();

    deleteModal.then((dialogRef) => {
      dialogRef.result.then((result) => {
        if(result) {
          this.productsService.deleteProduct(key, categories, store);
        }
      }).catch((err) => {
        
      });
    });
    
  }
}

export class SavedProducts {
  constructor() {

  }
}