import { Component, OnInit } from '@angular/core';
import { ProductsService } from './services/products.service';

import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase/app';
import 'rxjs/add/operator/map';
import { PaginationInstance } from 'ngx-pagination';

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

  constructor(private productsService: ProductsService, private afAuth: AngularFireAuth, private dialogService: TdDialogService,
    private viewContainerRef: ViewContainerRef) {

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
      if (!user) {
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
    this.query = '';

    this.productsSubject.next(this.lastSelected);
  }

  deleteProduct(key, categories, store, picsQty) {
    this.dialogService.openConfirm({
      message: `Você realmente deseja excluir este produto?`,
      disableClose: true,
      viewContainerRef: this.viewContainerRef,
      title: '',
      cancelButton: 'Cancelar',
      acceptButton: 'Excluir',
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        this.productsService.deleteProduct(key, categories, store, picsQty);
      }
    });

  }
}
