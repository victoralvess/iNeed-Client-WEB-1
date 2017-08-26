import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2/database';
import { ProductsService } from './services/products.service';
import { Router } from '@angular/router';

import * as firebase from 'firebase';
import 'rxjs/add/operator/map';
import { PaginationInstance } from 'ngx-pagination';

import { Modal } from 'ngx-modialog/plugins/bootstrap';

@Component({
  selector: 'app-products-dashboard',
  templateUrl: './products-dashboard.component.html',
  styleUrls: ['./products-dashboard.component.css']
})
export class ProductsDashboardComponent implements OnInit {

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

  constructor(private router : Router, private productsService : ProductsService, private modal : Modal) { 
    productsService.getUser().subscribe((user) => {
      this.stores = user.worksAt;
      this.products = this.productsService.getProductsFrom(this.stores[0]);
      this.productsService.getProductsFrom(this.stores[0]).subscribe(store => console.log(store));
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

  deleteProduct(key, store) {
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
          this.productsService.deleteProduct(key, store);
        }
      });
    });
    
  }
}