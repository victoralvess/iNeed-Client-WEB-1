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

	user : firebase.User;
  databaseChanged = new Subject<Message>();
  pictureAdded = new Subject<any>();
picsUploaded = 0;
  constructor(public db : AngularFireDatabase, private auth : AuthService, private http : Http, private notifications : NotificationsService) {
  	this.user = firebase.auth().currentUser;
    this.pictureAdded.asObservable().subscribe((product) => {
      console.log('picsUp', this.picsUploaded);
      
      this.db.app.database().ref(`/products/${product.key}/pictures/${this.picsUploaded}`).set(product.url);
          this.db.app.database().ref(`/products-stores/${product.store}/${product.key}/pictures/${this.picsUploaded}`).set(product.url);
          this.db.app.database().ref(`/products-categories/${product.category}/${product.key}/pictures/${this.picsUploaded}`).set(product.url);
          
this.picsUploaded++;
    });
  }

  getUser() {
  	return this.db.object(`users/${this.user.uid}`);
  }

  getAllCategories() {
    return this.db.list(`/categories`);
  }

  getProductsFrom(thisStore, params?) {
		return this.db.list(`/products-stores/${thisStore}`);
  }

  addProduct(product) {
    product.stores.forEach((store) => {

      let newProduct = {
        name : product.name,
        description : product.description,
        price : product.price,
        store : store,
        categories : product.selectedCategories,
      };

      let productsRef = this.db.app.database().ref(`/products`);
      let newFirebaseProduct = productsRef.push(newProduct);

      let key = newFirebaseProduct.key;

      let linkProductToStoreRef = this.db.app.database().ref(`/products-stores/${store}/${key}`);
      linkProductToStoreRef.set(newProduct);
let picIndex = 0;
      product.selectedCategories.forEach((category) => {
        this.db.app.database().ref(`/products-categories/${category}/${key}`).set(newProduct);
 
      (<string[]>product.images).forEach(product => {
        firebase.storage().ref(`/${store}/${key}/${picIndex}.jpeg`).putString(product, 'data_url', {
          contentType: 'image/jpeg'
        }).then((snapshot) => {          
          console.log('dUrl', snapshot.downloadURL);
          this.pictureAdded.next({ key: key, store: store, category: category, url: snapshot.downloadURL })
        });

        picIndex++;
          
        }); 
      });
   /*  .then(snapshot => {
          console.log('dUrl', snapshot.downloadURL);
            this.db.app.database().ref(`/products/${key}/pictures/${picIndex}`).set(snapshot.downloadURL);
            this.db.app.database().ref(`/products-stores/${store}/${key}/pictures/${picIndex}`).set(snapshot.downloadURL);
            this.db.app.database().ref(`/products-categories/${category}/${key}/pictures/${picIndex}`).set(snapshot.downloadURL);
      
      
      */
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

    for(let i = 0; i < picsQty; i++) {
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
