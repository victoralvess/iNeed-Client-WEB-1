import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../../../../shared/services/services-auth/auth.service';
import { Http } from '@angular/http';

<<<<<<< HEAD
import * as firebase from 'firebase/app';
=======
import * as firebase from 'firebase';
>>>>>>> stores-module

import { Subject } from 'rxjs/Subject';

import { NotificationsService } from '../../../../shared/services/notifications/notifications.service';
import { Message } from 'primeng/primeng';

@Injectable()
export class ProductsService {

  optimizationAPI = 'http://localhost:8081';

	user : firebase.User;
  databaseChanged = new Subject<Message>();
<<<<<<< HEAD

  constructor(public db : AngularFireDatabase, private auth : AuthService, private http : Http, private notifications : NotificationsService) {
  	this.user = firebase.auth().currentUser;
=======
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
>>>>>>> stores-module
  }

  getUser() {
  	return this.db.object(`users/${this.user.uid}`);
  }

  getAllCategories() {
    return this.db.list(`/categories`);
  }

  getProductsFrom(thisStore, params?) {
<<<<<<< HEAD
		return this.db.list(`/products-stores/${thisStore}`, {
      query : params || {
        orderByChild: 'name'
      }
		});
=======
		return this.db.list(`/products-stores/${thisStore}`);
>>>>>>> stores-module
  }

  addProduct(product) {
    product.stores.forEach((store) => {

      let newProduct = {
        name : product.name,
        description : product.description,
        price : product.price,
        store : store,
        categories : product.selectedCategories,
<<<<<<< HEAD
        pictures : product.images
      };

      let productsRef = this.db.database.ref(`/products`);
=======
      };

      let productsRef = this.db.app.database().ref(`/products`);
>>>>>>> stores-module
      let newFirebaseProduct = productsRef.push(newProduct);

      let key = newFirebaseProduct.key;

<<<<<<< HEAD
      let linkProductToStoreRef = this.db.database.ref(`/products-stores/${store}/${key}`);
      linkProductToStoreRef.set(newProduct);

      product.selectedCategories.forEach((category) => {
        this.db.database.ref(`/products-categories/${category}/${key}`).set(newProduct);
      });

=======
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
>>>>>>> stores-module
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

<<<<<<< HEAD
    this.db.database.ref().update(updates);
=======
    this.db.app.database().ref().update(updates);
>>>>>>> stores-module

    this.verifyChangesOnProducts(product.productId, 'Sucesso!', `O produto ${product.productId} foi atualizado com êxito!`);

  }

<<<<<<< HEAD
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
=======
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
>>>>>>> stores-module
      this.databaseChanged.next(this.notifications.success(successSummary, successMessage));
    });
  }

  optmizeImage(file) {
    return this.http.post(`${this.optimizationAPI}/ws/0/optmize`, file);
  }
}
