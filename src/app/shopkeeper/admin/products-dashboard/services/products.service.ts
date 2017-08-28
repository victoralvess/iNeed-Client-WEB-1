import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../../../../shared/services/services-auth/auth.service';

import * as firebase from 'firebase/app';

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
        store : store,
        categories : product.selectedCategories,
        pictures : product.images
      };

      let key = this.db.database.ref(`/products`).push(newProduct).key;   
      this.db.database.ref(`/products-stores/${store}/${key}`).set(newProduct);
    });    
  }

  updateProduct(product) {
    let updatedProduct = {
      name : product.name,
      description : product.description,
      price : product.price,
      categories : product.selectedCategories,
      pictures : product.images
    };    

    this.db.database.ref(`products/${product.productId}`).update(updatedProduct);
    this.db.database.ref(`/products-stores/${product.productStore}/${product.productId}`).update(updatedProduct);
  }

  removeImageFrom(productId, imageKey) {
    this.getStoreFrom(productId).subscribe(store => {
      this.db.database.ref(`/products/${productId}/pictures/${imageKey}`).remove();
      this.db.database.ref(`/products-stores/${store.$value}/${productId}/pictures/${imageKey}`).remove();
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
