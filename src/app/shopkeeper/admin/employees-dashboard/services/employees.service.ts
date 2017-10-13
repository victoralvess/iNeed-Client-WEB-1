import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../../../../shared/services/services-auth/auth.service';

import * as firebase from 'firebase/app';

@Injectable()
export class EmployeesService {

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

  getEmployeesFrom(thisStore, params?) {
<<<<<<< HEAD
		return this.db.list(`/employees-stores/${thisStore}`, {
      query : params || {
        orderByChild: 'name'
      } 
		}); 
=======
		return this.db.list(`/employees-stores/${thisStore}`); 
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
        pictures : product.images
      };

<<<<<<< HEAD
      let productsRef = this.db.database.ref(`/products`);
=======
      let productsRef = this.db.app.database().ref(`/products`);
>>>>>>> stores-module
      let newFirebaseProduct = productsRef.push(newProduct);      
      
      let key = newFirebaseProduct.key;   
      
<<<<<<< HEAD
      let linkProductToStoreRef = this.db.database.ref(`/products-stores/${store}/${key}`);
      linkProductToStoreRef.set(newProduct);
      
      product.selectedCategories.forEach((category) => {
        this.db.database.ref(`/products-categories/${category}/${key}`).set(newProduct);
=======
      let linkProductToStoreRef = this.db.app.database().ref(`/products-stores/${store}/${key}`);
      linkProductToStoreRef.set(newProduct);
      
      product.selectedCategories.forEach((category) => {
        this.db.app.database().ref(`/products-categories/${category}/${key}`).set(newProduct);
>>>>>>> stores-module
      });                 
      
    });  	
  }

  updateEmployee(employee) {
    
    console.log('stooooooooooore', employee.productStore);
    let updatedProduct = {
      name : employee.name,
      description : employee.description,
      price : employee.price,
      categories : employee.selectedCategories,
      pictures : employee.images,
      store : employee.productStore
    };  

    let updates = {};
    updates[`/products/${employee.productId}`] = updatedProduct;
    updates[`/products-stores/${employee.productStore}/${employee.productId}`] = updatedProduct;
    
    employee.selectedCategories.forEach((category) => {
        updates[`/products-categories/${category}/${employee.productId}`] = updatedProduct;
    }); 

<<<<<<< HEAD
    this.db.database.ref().update(updates);
  }

  deleteEmployee(key, categories, store) { 
    let productsRef = this.db.database.ref(`/products`);
    productsRef.child(`${key}`).remove();
    this.db.database.ref(`/products-stores/${store}/${key}`).remove();
    categories.forEach((category) => {
      this.db.database.ref(`/products-categories/${category}/${key}`).remove();
=======
    this.db.app.database().ref().update(updates);
  }

  deleteEmployee(key, categories, store) { 
    let productsRef = this.db.app.database().ref(`/products`);
    productsRef.child(`${key}`).remove();
    this.db.app.database().ref(`/products-stores/${store}/${key}`).remove();
    categories.forEach((category) => {
      this.db.app.database().ref(`/products-categories/${category}/${key}`).remove();
>>>>>>> stores-module
    }); 
  }
}
