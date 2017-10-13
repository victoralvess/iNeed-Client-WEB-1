import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { Http } from '@angular/http';

import * as firebase from 'firebase';

import { Subject } from 'rxjs/Subject';

@Injectable()
export class StoresService {

  optimizationAPI = 'http://localhost:8081';

  pictureAdded$ = new Subject<any>();
  picsUploaded = 0;

  user: firebase.User;
  stores$ = new Subject<FirebaseObjectObservable<any>[]>();

  constructor(public db: AngularFireDatabase, private http: Http) {
    this.user = firebase.auth().currentUser;

    this.pictureAdded$.asObservable().subscribe((store) => {
      this.user = firebase.auth().currentUser;
      console.log('picsUp', this.picsUploaded);
      this.db.app.database().ref(`/stores/${store.key}/pictures/${this.picsUploaded}`).set(store.url);
      this.db.app.database().ref(`/employees-stores/${this.user.uid}/${store.key}/pictures/${this.picsUploaded}`).set(store.url);
      this.picsUploaded++;
    });
  }
/*
  

  getProductsFrom(thisStore, params?) {
		return this.db.list(`/products-stores/${thisStore}`);
  }*/

  private getUser() {
    return this.db.object(`users/${this.user.uid}`);
  }

  getAllStores() {
    let allStores: FirebaseObjectObservable<any>[] = [];
    /*this.getUser().subscribe((user) => {
      const stores = Object.keys(user.works);
      stores.forEach((store, index) => {
        if (user.works[store] === true) {
          console.log('true');
          allStores.push(this.db.object(`/stores/${store}`));
        }

        if (index === stores.length - 1) {
          this.stores$.next(allStores);
        }
      });
    });*/
/*
    this.db.object(`/employees-stores/${this.user.uid}`).subscribe((storesList) => {
console.log(storesList);
      const storesIds = Object.keys(storesList);
console.log(storesIds);
      storesIds.forEach((id, index) => {
console.log(id);
        if (storesList[id]) {
if(id != 'store1' && id != 'store2'){
          console.log('true');

          allStores.push(this.db.object(`/stores/${id}`));}
        }

        if (index === storesIds.length - 1) {
          this.stores$.next(allStores);
        }
      });
    });*/
    return this.db.list(`/employees-stores/${this.user.uid}`);
  }

  getAllCategories() {
    return this.db.list(`/categories`);
  }

  addStore(store, pictures: string[]) {
    this.picsUploaded = 0;

    const storesRef = this.db.app.database().ref(`/stores`);
    const key = storesRef.push(store).key;

    this.db.app.database().ref(`/employees-stores/${this.user.uid}/${key}`).set(store);

    let picIndex = 0;

    pictures.forEach((pic) => {
      firebase.storage().ref(`/${key}/pics/${picIndex}.jpeg`).putString(pic, 'data_url', {
        contentType: 'image/jpeg'
      }).then((snapshot) => {
        console.log('dUrl', snapshot.downloadURL);
        this.pictureAdded$.next({ key: key, url: snapshot.downloadURL });
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

  deleteStore(key: string, picsQty) {
    const storesRef = this.db.app.database().ref(`/stores`);
    storesRef.child(`${key}`).remove();
    this.db.app.database().ref(`/products-stores/${key}`).remove();
    this.getAllCategories().subscribe((categories) => {
      categories.forEach((category) => {
        this.db.list(`/products-categories/${category.$key}`, {
          query: {
            orderByChild: 'store',
            equalTo: `${key}`
          }
        }).subscribe((products) => {
          products.forEach((product) => {
            this.db.app.database().ref(`/products-categories/${category.$key}/${product.$key}`).remove();
            this.db.app.database().ref(`/products/${product.$key}`).remove();
          });
        });
      });
    });

    this.db.list(`/employees-stores/${this.user.uid}/${key}`).remove();

    for (let i = 0; i < picsQty; i++) {
      const fileRef = firebase.storage().ref(`/${key}/pics/${i}.jpeg`).delete();
    }
  }

  optmizeImage(file) {
    return this.http.post(`${this.optimizationAPI}/ws/0/optmize`, file);
  }
}
