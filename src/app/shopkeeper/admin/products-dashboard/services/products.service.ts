import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../../../../shared/services/services-auth/auth.service';

import * as firebase from 'firebase/app';

import { AddProductsComponent } from '../add-products/add-products.component'

import { ProductsDashboardComponent } from '../products-dashboard.component';

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

      let productsRef = this.db.database.ref(`/products`);
      let newFirebaseProduct = productsRef.push(newProduct);      
      
      let key = newFirebaseProduct.key;   
      
      let linkProductToStoreRef = this.db.database.ref(`/products-stores/${store}/${key}`);
      linkProductToStoreRef.set(newProduct);

      newFirebaseProduct.once('value', (snapshot) => {
        if(ProductsDashboardComponent.savedProducts[`${store}`] != null) {
          ProductsDashboardComponent.savedProducts[`${store}`] += JSON.stringify(snapshot.val());
        } else {
          ProductsDashboardComponent.products = this.getProductsFrom(store);
          ProductsDashboardComponent.products.subscribe((products) => {
            ProductsDashboardComponent.savedProducts[`${store}`] += JSON.stringify(products); 
          });
        }

        console.log(ProductsDashboardComponent.savedProducts[`${store}`]);
        //ProductsDashboardComponent.savedProducts[`${store}`] = snapshot.val();
      });

      product.selectedCategories.forEach((category) => {
        this.db.database.ref(`/products-categories/${category}/${key}`).set(newProduct);
      });                 
      
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
  }

  deleteProduct(key, categories, store) {    
    this.db.database.ref(`/products/${key}`).remove();
    this.db.database.ref(`/products-stores/${store}/${key}`).remove();
    categories.forEach((category) => {
      this.db.database.ref(`/products-categories/${category}/${key}`).remove();
    }); 
    
  }
}
