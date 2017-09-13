import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../../../../shared/services/services-auth/auth.service';
import { Http } from '@angular/http';

import * as firebase from 'firebase/app';

import { Subject } from 'rxjs/Subject';

import { NotificationsService } from '../../../../shared/services/notifications/notifications.service';
import { Message } from 'primeng/primeng';

@Injectable()
export class ProductsService {

  optimizationAPI = 'http://localhost:8081';

	user : firebase.User;
  databaseChanged = new Subject<Message>();

  constructor(public db : AngularFireDatabase, private auth : AuthService, private http : Http, private notifications : NotificationsService) {
  	this.user = firebase.auth().currentUser;
  }

  getUser() {
  	return this.db.object(`users/${this.user.uid}`);
  }

  getAllCategories() {
    return this.db.list(`/categories`);
  }

  getProductsFrom(thisStore, params?) {
		return this.db.list(`/products-stores/${thisStore}`, {
      query : params || {
        orderByChild: 'name'
      }
		});
  }

  addProduct(product) {
    product.stores.forEach((store) => {

      let newProduct = {
        name : product.name,
        description : product.description,
        price : product.price,
        store : store,
        categories : product.selectedCategories,
        pictures : product.images
      };

      let productsRef = this.db.database.ref(`/products`);
      let newFirebaseProduct = productsRef.push(newProduct);

      let key = newFirebaseProduct.key;

      let linkProductToStoreRef = this.db.database.ref(`/products-stores/${store}/${key}`);
      linkProductToStoreRef.set(newProduct);

      product.selectedCategories.forEach((category) => {
        this.db.database.ref(`/products-categories/${category}/${key}`).set(newProduct);
      });

      this.verifyChangesOnProducts(key, 'Sucesso!', 'O produto foi cadastrado com êxito!');

    });
  }

  updateProduct(product) {

    console.log('stooooooooooore', product.productStore);
    let updatedProduct = {
      name : product.name,
      description : product.description,
      price : product.price,
      categories : product.selectedCategories,
      pictures : product.images,
      store : product.productStore
    };

    let updates = {};
    updates[`/products/${product.productId}`] = updatedProduct;
    updates[`/products-stores/${product.productStore}/${product.productId}`] = updatedProduct;

    product.selectedCategories.forEach((category) => {
        updates[`/products-categories/${category}/${product.productId}`] = updatedProduct;
    });

    this.db.database.ref().update(updates);

    this.verifyChangesOnProducts(product.productId, 'Sucesso!', `O produto ${product.productId} foi atualizado com êxito!`);

  }

  deleteProduct(key, categories, store) {
    let productsRef = this.db.database.ref(`/products`);
    productsRef.child(`${key}`).remove();
    this.db.database.ref(`/products-stores/${store}/${key}`).remove();
    categories.forEach((category) => {
      this.db.database.ref(`/products-categories/${category}/${key}`).remove();
    });
  }

  verifyChangesOnProducts(productKey, successSummary, successMessage) {
    this.db.database.ref(`/products/${productKey}`).once('value', (s) => {
      this.databaseChanged.next(this.notifications.success(successSummary, successMessage));
    });
  }

  optmizeImage(file) {
    return this.http.post(`${this.optimizationAPI}/ws/0/optmize`, file);
  }
}
