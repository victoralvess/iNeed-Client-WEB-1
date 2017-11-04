import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../../../../shared/services/services-auth/auth.service';

import * as firebase from 'firebase/app';
import { CrudService } from '../../../../shared/services/crud-service/crud.service';
import { Auth0Service } from '../../../../shared/services/auth0-service/auth0.service';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EmployeesService {

  user: firebase.User;
  signUp$ = new Subject<boolean>();

  constructor(public db: AngularFireDatabase, private auth: AuthService, private crudService: CrudService, private auth0Service: Auth0Service) {
    this.user = firebase.auth().currentUser;
    this.signUp$.asObservable().subscribe((signedUp) => {
      if (signedUp) {
        // SHOW NOTIFICATION
        // LOGIN TESTE this.auth0Service.employeeLogin();
      }
    });
  }

  getUser() {
    return this.db.object(`users/${this.user.uid}`);
  }

  getAllCategories() {
    return this.db.list(`/categories`);
  }

  getEmployeesFrom(thisStore, params?) {
    return this.db.list(`/stores-employees/${thisStore}`);
  }

  addEmployee(employee) {
    const signedUp = this.auth0Service.signUp({
      email: employee.email, password: 'DEFAULT', user_metadata: {
        name: employee.name,
        permissionLevel: employee.permissionLevel,
        worksAt: employee.stores
      }
    }, this.signUp$);
  }

  updateEmployee(employee) {
    this.db.app.database().ref(`/users/${employee.employeeId}`).update({
      permissionLevel: employee.permissionLevel
    });
    this.db.app.database().ref(`employees-stores/${employee.employeeId}`).remove();

    (<any[]>employee.previousStoresIds).forEach((prev) => {
      if (employee.stores.indexOf(prev) < 0) {
        this.db.object(`/stores-employees/${prev}/${employee.employeeId}`).remove();
      }
    });
    
    employee.stores.forEach((storeId) => {
      this.db.app.database().ref(`stores/${storeId}`).once('value', (snapshot) => {
        const obj = snapshot.val();
        this.db.app.database().ref(`employees-stores/${employee.employeeId}/${obj.id}`).set(obj);
      });

      this.db.app.database().ref(`/users/${employee.employeeId}`).once('value', (snapshot) => {
        this.db.object(`/stores-employees/${storeId}/${employee.employeeId}`).set(snapshot.val());
      });
    });
  }

  deleteEmployee(id, storeId?) {
    if (storeId) {
      this.db.app.database().ref(`employees-stores/${id}/${storeId}`).remove();
    } else {
      this.db.app.database().ref(`users/${id}`).remove();
      this.db.app.database().ref(`employees-stores/${id}`).remove();
    }
  }

  getStoresWhereUserWorks() {
    return this.crudService.getStoresWhereUserWorks();
  }

  getStoresWhereEmployeeWorks(employeeId) {
    return this.db.list(`employees-stores/${employeeId}`);
  }

  optmizeImage(file) {
    return this.crudService.optmizeImage(file);
  }
}
