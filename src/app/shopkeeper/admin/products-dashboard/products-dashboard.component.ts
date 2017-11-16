import { Component } from '@angular/core';
import { ProductsService } from './services/products.service';

import { AngularFireAuth } from 'angularfire2/auth';

import { User } from 'firebase/app';

import { Subject } from 'rxjs/Subject';
import { ViewContainerRef } from '@angular/core';
import { TdDialogService } from '@covalent/core';
import { Router } from '@angular/router';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-products-dashboard',
  templateUrl: './products-dashboard.component.html',
  styleUrls: ['./products-dashboard.component.css']
})
export class ProductsDashboardComponent {

  stores: any[];
  user: User;
  userSubscription;
  lastSelected;
  products$ = new Subject<string>();
  displayedColumns = ['name', 'price', 'upVotes', 'downVotes', 'actions'];
  dataSource: ProductsDataSource;

  constructor(private productsService: ProductsService, private afAuth: AngularFireAuth, private dialogService: TdDialogService,
    private viewContainerRef: ViewContainerRef, private router: Router) {

    this.products$.asObservable().subscribe((storeId) => {
      this.dataSource = new ProductsDataSource(productsService, storeId);
    });

    this.userSubscription = productsService.getStoresWhereUserWorks().subscribe((stores) => {
      this.stores = stores;
      this.lastSelected = this.stores[0].$key;
      this.products$.next(this.lastSelected);
    });


    this.afAuth.auth.onAuthStateChanged((user) => {
      if (!user) {
        console.log('destrói tuto chessus');
        this.userSubscription.unsubscribe();
        this.products$.unsubscribe();
      }
    });
  }

  onChange(value) {
    this.lastSelected = value;
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

  updateProduct(key) {
    this.router.navigate([`/shopkeeper/dashboard/admin/products/edit/${key}`]);
  }
}

export class ProductsDataSource extends DataSource<any> {

  constructor(private productsService: ProductsService, private storeId) {
    super();
  }

  connect(): Observable<any[]> {
    return this.productsService.getProductsFrom(this.storeId);
  }

  disconnect() { }
}
