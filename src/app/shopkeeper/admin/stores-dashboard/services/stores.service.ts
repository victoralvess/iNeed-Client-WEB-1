import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Http } from '@angular/http';

import * as firebase from 'firebase/app';

import { Subject } from 'rxjs/Subject';

@Injectable()
export class StoresService {

  optimizationAPI = 'http://localhost:8081';

  pictureAdded = new Subject<any>();
  picsUploaded = 0;

  user: firebase.User;

  constructor(public db: AngularFireDatabase, private http: Http) {

    this.pictureAdded.asObservable().subscribe((store) => {
      this.user = firebase.auth().currentUser;
      console.log('picsUp', this.picsUploaded);
      this.db.app.database().ref(`/stores/${store.key}/pictures/${this.picsUploaded}`).set(store.url);
      this.picsUploaded++;
    });
  }
/*
  getUser() {
  	return this.db.object(`users/${this.user.uid}`);
  }

  getProductsFrom(thisStore, params?) {
		return this.db.list(`/products-stores/${thisStore}`);
  }*/

  getAllStores() {
  }

  getAllCategories() {
    return this.db.list(`/categories`);
  }

  addStore(store, pictures: string[]) {

      const storesRef = this.db.app.database().ref(`/stores`);
      const key = storesRef.push(store).key;

      let picIndex = 0;

      pictures.forEach((pic) => {
        firebase.storage().ref(`/${key}/pics/${picIndex}.jpeg`).putString(pic, 'data_url', {
          contentType: 'image/jpeg'
        }).then((snapshot) => {
          console.log('dUrl', snapshot.downloadURL);
          this.pictureAdded.next({ key: key, url: snapshot.downloadURL });
        });

        picIndex++;

       });
  }
/*
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

  verifyChangesOnProducts(productKey, successSummary, successMessage) {
    this.db.app.database().ref(`/products/${productKey}`).once('value', (s) => { 
      this.databaseChanged.next(this.notifications.success(successSummary, successMessage));
    });
  }*/

  deleteStore(key, picsQty) {
    const storesRef = this.db.app.database().ref(`/stores`);
    storesRef.child(`${key}`).remove();
    this.db.app.database().ref(`/products-stores/${key}`).remove();
    this.getAllCategories().subscribe((categories) => {
      categories.forEach((category) => {
        this.db.list(`/products-categories/${category.key}`, {
          query: {
            orderByChild: 'store',
            equalTo: `${key}`
          }
        }).subscribe((products) => {
          products.forEach((product) => {
            this.db.app.database().ref(`/products-categories/${category.key}/${product.key}`).remove();
            this.db.app.database().ref(`/products/${product.key}`).remove();
          });
        });
      });
    });

    for (let i = 0; i < picsQty; i++) {
      const fileRef = firebase.storage().ref(`/${key}/pics/${i}.jpeg`).delete();
    }
  }

  optmizeImage(file) {
    return this.http.post(`${this.optimizationAPI}/ws/0/optmize`, file);
  }
}
