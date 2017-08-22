import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../../../../shared/services/services-auth/auth.service';

import { UUID } from 'angular2-uuid';

import * as firebase from 'firebase/app';
import 'rxjs/add/operator/map';

import { AddProductsComponent } from '../add-products/add-products.component'
@Injectable()
export class ProductsService {

	user : firebase.User;

  constructor(public db : AngularFireDatabase, private auth : AuthService) {
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
        store : store
      };

      let key = this.db.database.ref(`/products`).push(newProduct).key;   
      this.db.database.ref(`/products-stores/${store}/${key}`).set(newProduct);
      this.setCategories(product, store, key);     
      this.uploadImages(product.images, store, key);
    });  	
  }

  updateProduct(product) {
    let updatedProduct = {
      name : product.name,
      description : product.description,
      price : product.price
    };

    this.db.database.ref(`products/${product.productId}`).update(updatedProduct);

    this.db.object(`products/${product.productId}`).subscribe((databaseProduct) => {      
      this.db.database.ref(`/products-stores/${databaseProduct.store}/${product.productId}`).update(updatedProduct);
      this.setCategories(product, databaseProduct.store, product.productId);
    });
    
  }

  setCategories(product, store, productId) {

    this.db.database.ref(`/products/${productId}/categories`).remove();
    this.db.database.ref(`/products-stores/${store}/${productId}/categories`).remove();
    
    product.selectedCategories.forEach((category) => {      
      this.db.database.ref(`/products/${productId}/categories/${category}`).set(true);
      this.db.database.ref(`/products-stores/${store}/${productId}/categories/${category}`).set(true);
    });
  }

  getCategoriesFrom(product) {
    return Object.keys(product.categories);
  }

  uploadImages(files : any[], store : any, productKey) {
    files.forEach((file) => {
      let byteString = atob(file.src.split(',')[1]);
      let mimeString = file.src.split(',')[0].split(':')[1].split(';')[0]

      let arrayBuffer = new ArrayBuffer(byteString.length);
      let uInt8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
          uInt8Array[i] = byteString.charCodeAt(i);
      }

      let blob = new Blob([arrayBuffer]);
      /*UPLOAD ADDITIONAL INFO*/
      let uuid = UUID.UUID();
      let ext = mimeString.split('/')[1];      
      let metadata = { 
        contentType: mimeString
      };
      console.log(uuid);
      let uploadTask = firebase.storage().ref(`${store}/${productKey}/${uuid}.${ext}`).put(blob, metadata);
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
        let up = snapshot as firebase.storage.UploadTaskSnapshot;
        let progress = (up.bytesTransferred / up.totalBytes) * 100;
        console.log(uuid, 'Upload is ' + progress + '% done');
      });

      uploadTask.then((snapshot) => {        
        let image = {
          downloadURL: snapshot.downloadURL,
          uuid: uuid,
          imageExt: ext
        };
        this.db.database.ref(`/products/${productKey}/pictures/`).push(image);
        this.db.database.ref(`/products-stores/${store}/${productKey}/pictures/`).push(image);
      });   
    });      
  }

  getImagesFrom(thisProduct) {
    return this.db.list(`/products/${thisProduct}/pictures/`);
  }

  removeImageFrom(productId, image, uuid, ext) {
    this.getStoreFrom(productId).subscribe(store => {
      console.log(store.$value);
      firebase.storage().ref(`${store.$value}/${productId}/${uuid}.${ext}`).delete().then((success) => {
        this.db.database.ref(`/products/${productId}/pictures/${image}`).remove();
        this.db.database.ref(`/products-stores/${store.$value}/${productId}/pictures/${image}`).remove();
      });
    });     
  }

  getStoreFrom(thisProduct) {
    return this.db.object(`/products/${thisProduct}/store`); 
  }

  deleteProduct(key, store) {
    this.db.database.ref(`/products/${key}`).remove();
    this.db.database.ref(`/products-stores/${store}/${key}`).remove();
  }

}
