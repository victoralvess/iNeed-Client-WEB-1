import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../../../../shared/services/services-auth/auth.service';
import { Http } from '@angular/http';

import * as firebase from 'firebase';

import { Subject } from 'rxjs/Subject';

import { NotificationsService } from '../../../../shared/services/notifications/notifications.service';
import { Message } from 'primeng/primeng';

@Injectable()
export class ProductsService {

  optimizationAPI = 'http://localhost:8081';

  user: firebase.User;
  databaseChanged = new Subject<Message>();
  pictureAdded = new Subject<any>();
  picsUploaded = {};
  picIndex = {};

  constructor(public db : AngularFireDatabase, private auth : AuthService, private http : Http, private notifications : NotificationsService) {
    this.user = firebase.auth().currentUser;
    this.pictureAdded.asObservable().subscribe((product) => {
      console.log('picsUp', this.picsUploaded);

      this.db.app.database().ref(`/products/${product.key}/pictures/${this.picsUploaded[product.key]}`).set(product.url);
      this.db.app.database().ref(`/products-stores/${product.store}/${product.key}/pictures/${this.picsUploaded[product.key]}`).set(product.url);
      product.categories.forEach((category) => {
        this.db.app.database().ref(`/products-categories/${category}/${product.key}/pictures/${this.picsUploaded[product.key]}`).set(product.url);
      });

      this.picsUploaded[product.key]++;
    });
  }

  getUser() {
    return this.db.object(`users/${this.user.uid}`);
  }

  getStoresWhereUserWorks() {
    return this.db.list(`/employees-stores/${this.user.uid}`);
  }

  getAllCategories() {
    return this.db.list(`/categories`);
  }

  getProductsFrom(thisStore, params?) {
    return this.db.list(`/products-stores/${thisStore}`);
  }

  addProduct(product) {
    product.stores.forEach((store) => {
      const newProduct = {
        name : product.name,
        description : product.description,
        price : product.price,
        store : store,
        categories : product.selectedCategories,
      };

      const productsRef = this.db.app.database().ref(`/products`);
      const key = productsRef.push(newProduct).key;

      this.picsUploaded[key] = 0;

      this.db.app.database().ref(`/products-stores/${store}/${key}`).set(newProduct);
      this.picIndex[key] = 0;
      product.selectedCategories.forEach((category) => {
        this.db.app.database().ref(`/products-categories/${category}/${key}`).set(newProduct);
      });
console.log('qtd', product.images.length);
      (<string[]>product.images).forEach((image) => {
        firebase.storage().ref(`/${store}/${key}/${this.picIndex[key]}.jpeg`).putString(image, 'data_url', {
          contentType: 'image/jpeg'
        }).then((snapshot) => {
          console.log('dUrl', snapshot.downloadURL);
          this.pictureAdded.next({ key: key, store: store, categories: product.selectedCategories, url: snapshot.downloadURL });
        });

        this.picIndex[key]++;

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

    this.db.app.database().ref().update(updates);

    this.verifyChangesOnProducts(product.productId, 'Sucesso!', `O produto ${product.productId} foi atualizado com êxito!`);

  }

  deleteProduct(key, categories, store, picsQty) {
    let productsRef = this.db.app.database().ref(`/products`);
    productsRef.child(`${key}`).remove();
    this.db.app.database().ref(`/products-stores/${store}/${key}`).remove();
    categories.forEach((category) => {
      this.db.app.database().ref(`/products-categories/${category}/${key}`).remove();
    });

    for (let i = 0; i < picsQty; i++) {
      let fileRef = firebase.storage().ref(`/${store}/${key}/${i}.jpeg`).delete();
    }
  }

  verifyChangesOnProducts(productKey, successSummary, successMessage) {
    this.db.app.database().ref(`/products/${productKey}`).once('value', (s) => { 
      this.databaseChanged.next(this.notifications.success(successSummary, successMessage));
    });
  }

  optmizeImage(file) {
    return this.http.post(`${this.optimizationAPI}/ws/0/optmize`, file);
  }
}
