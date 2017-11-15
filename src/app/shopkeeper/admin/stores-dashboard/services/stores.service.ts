import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';

import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase';
import { Subject } from 'rxjs/Subject';
import { CrudService } from '../../../../shared/services/crud-service/crud.service';

@Injectable()
export class StoresService {

  pictureAdded$ = new Subject<any>();
  picsUploaded = 0;

  user: firebase.User;
  stores$ = new Subject<FirebaseObjectObservable<any>[]>();

  constructor(public db: AngularFireDatabase, private crudService: CrudService) {
    this.user = firebase.auth().currentUser;

    this.pictureAdded$.asObservable().subscribe((store) => {
      this.user = firebase.auth().currentUser;
      console.log('picsUp', this.picsUploaded);
      this.db.app.database().ref(`/stores/${store.key}/pictures/${this.picsUploaded}`).set(store.url);
      this.db.app.database().ref(`/employees-stores/${this.user.uid}/${store.key}/pictures/${this.picsUploaded}`).set(store.url);
      this.picsUploaded++;
    });
  }

  private getUser() {
    return this.crudService.getUser();
  }

  getAllStores() {
    return this.db.list(`/employees-stores/${this.user.uid}`);
  }

  getAllCategories() {
    return this.crudService.getAllCategories();
  }

  addStore(store, pictures: string[]) {
    this.picsUploaded = 0;

    const storesRef = this.db.app.database().ref(`/stores`);
    const key = storesRef.push(store).key;

    this.db.object(`/stores/${key}/id`).set(key);
    this.db.database.ref(`users/${this.user.uid}`).once('value', (snapshot) => {
      this.db.object(`/stores-employees/${key}/${this.user.uid}`).set(snapshot.val());
    });

    this.db.object(`/employees-stores/${this.user.uid}/${key}`).set(store);
    this.db.object(`/employees-stores/${this.user.uid}/${key}/id`).set(key);

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

  deleteStore(key: string) {
    this.db.object(`/stores/${key}`).subscribe((store) => {
      if (store.pictures) {
        store.pictures.forEach((url) => {
          firebase.storage().refFromURL(url).delete();
        });
        this.db.object(`/stores/${key}`).remove();
        this.db.object(`/stores-employees/${key}`).remove();
        this.db.object(`/products-stores/${key}`).remove();
      }
    });

    this.getAllCategories().subscribe((categories) => {
      categories.forEach((category) => {
        this.db.list(`/products-categories/${category.$key}`, {
          query: {
            orderByChild: 'store',
            equalTo: `${key}`
          }
        }).subscribe((products) => {
          products.forEach((product) => {
            if (product.pictures) {
              product.pictures.forEach((url) => {
                firebase.storage().refFromURL(url).delete();
              });
              this.db.object(`/products-categories/${category.$key}/${product.$key}`).remove();
              this.db.object(`/products/${product.$key}`).remove();
            }
          });
        });
      });
    });

    this.db.list(`/employees-stores`).subscribe((employees) => {
      console.log('MYTAG_ALL', employees);
      employees.forEach((employee) => {
        const employeeId = employee.$key;
        if (employee[key]) { // IF EMPLOYEE WORKS AT `${key}` STORE
          console.log('MYTAG_STORE_KEY', key);
          console.log('MYTAG_STORE_DB', employee[key]);
          console.log('MYTAG_STORE_DB_ID', employee[key].id);
          console.log('MYTAG_EMPLOYEE_ID', employeeId);
          this.db.object(`/employees-stores/${employeeId}/${key}`).remove();
        }
      });
    });
  }

  optmizeImage(file) {
    return this.crudService.optmizeImage(file);
  }
}
