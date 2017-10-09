import { Component, OnInit } from '@angular/core';
import { ProductsService } from './services/products.service';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase/app';
import 'rxjs/add/operator/map';
import { PaginationInstance } from 'ngx-pagination';

import { Modal } from 'ngx-modialog/plugins/bootstrap';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ViewContainerRef } from '@angular/core';
import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'app-products-dashboard',
  templateUrl: './products-dashboard.component.html',
  styleUrls: ['./products-dashboard.component.css']
})
export class ProductsDashboardComponent implements OnInit {

  stores: any[];
  products;
  user: firebase.User;
  query: any;
  currentPage = 1;
  userSubscription;
  productsSubscription;
  lastSelected;
  productsSubject = new Subject<string>();
  public paginationComponentConfig: PaginationInstance = {
    id: 'products-pagination',
    itemsPerPage: 10,
    currentPage: 1
  };

  constructor(private router : Router, private productsService : ProductsService, private modal : Modal, private afAuth : AngularFireAuth, private _dialogService: TdDialogService,
    private _viewContainerRef: ViewContainerRef) {

      this.productsSubject.asObservable().subscribe((storeId) => {
        this.products = this.productsService.getProductsFrom(storeId);
        this.productsSubscription = this.products.subscribe();
});
 
    this.userSubscription = productsService.getUser().subscribe((user: any) => {
      this.stores = user.worksAt;
      this.lastSelected = this.stores[0].storeId;
      this.productsSubject.next(this.lastSelected);
    });


    this.afAuth.auth.onAuthStateChanged((user) => {
      if(!user) {
        console.log('destrói tuto chessus');
        this.products.subscribe().unsubscribe();
        this.userSubscription.unsubscribe();
        this.productsSubscription.unsubscribe();
        this.productsSubject.unsubscribe();
      }
    });
  }

  ngOnInit() { }

  onChange(value) {
    this.lastSelected = value;
    this.query = "";

    this.productsSubject.next(this.lastSelected);
  }

  deleteProduct(key, categories, store, picsQty) {
  	console.log('delete', key);
  	console.log('delete', categories);
  	console.log('delete', store);
    console.log('delete', picsQty);/*
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
    });*/

    this._dialogService.openConfirm({
      message: `Você realmente deseja excluir este produto?`,
      disableClose: true, // defaults to false
      viewContainerRef: this._viewContainerRef, //OPTIONAL
      title: '', //OPTIONAL, hides if not provided
      cancelButton: 'Cancelar', //OPTIONAL, defaults to 'CANCEL'
      acceptButton: 'Excluir', //OPTIONAL, defaults to 'ACCEPT'
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        // DO SOMETHING
        this.productsService.deleteProduct(key, categories, store, picsQty);
      } else {
        // DO SOMETHING ELSE
      }
    });

  }
}
