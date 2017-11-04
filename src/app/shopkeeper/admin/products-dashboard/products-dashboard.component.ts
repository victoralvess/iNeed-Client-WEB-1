import { Component } from '@angular/core';
import { ProductsService } from './services/products.service';

import { AngularFireAuth } from 'angularfire2/auth';

import { User } from 'firebase/app';
import { PaginationInstance } from 'ngx-pagination';

import { Subject } from 'rxjs/Subject';
import { ViewContainerRef } from '@angular/core';
import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'app-products-dashboard',
  templateUrl: './products-dashboard.component.html',
  styleUrls: ['./products-dashboard.component.css']
})
export class ProductsDashboardComponent {

  stores: any[];
  products;
  user: User;
  query: any;
  currentPage = 1;
  userSubscription;
  productsSubscription;
  lastSelected;
  products$ = new Subject<string>();
  public paginationComponentConfig: PaginationInstance = {
    id: 'products-pagination',
    itemsPerPage: 10,
    currentPage: 1
  };

  constructor(private productsService: ProductsService, private afAuth: AngularFireAuth, private dialogService: TdDialogService,
    private viewContainerRef: ViewContainerRef) {

    this.products$.asObservable().subscribe((storeId) => {
      this.products = this.productsService.getProductsFrom(storeId);
      this.productsSubscription = this.products.subscribe();
    });

    /*  this.userSubscription = productsService.getUser().subscribe((user: any) => {
        this.stores = user.worksAt;
        this.lastSelected = this.stores[0].storeId;
        this.products$.next(this.lastSelected);
      });*/

    this.userSubscription = productsService.getStoresWhereUserWorks().subscribe((stores) => {
      this.stores = stores;
      this.lastSelected = this.stores[0].$key;
      this.products$.next(this.lastSelected);
    });


    this.afAuth.auth.onAuthStateChanged((user) => {
      if (!user) {
        console.log('destrói tuto chessus');
        this.products.subscribe().unsubscribe();
        this.userSubscription.unsubscribe();
        this.productsSubscription.unsubscribe();
        this.products$.unsubscribe();
      }
    });
  }

  onChange(value) {
    this.lastSelected = value;
    this.query = '';

    this.products$.next(this.lastSelected);
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
