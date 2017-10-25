import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../../../../shared/services/services-auth/auth.service';

import * as firebase from 'firebase/app';
import { CrudService } from '../../../../shared/services/crud-service/crud.service';

@Injectable()
export class EmployeesService {

  user: firebase.User;

  constructor(public db: AngularFireDatabase, private auth: AuthService, private crudService: CrudService) {
    this.user = firebase.auth().currentUser;
  }

  getUser() {
    return this.db.object(`users/${this.user.uid}`);
  }

  getAllCategories() {
    return this.db.list(`/categories`);
  }

  getEmployeesFrom(thisStore, params?) {
    return this.db.list(`/employees-stores/${thisStore}`);
  }

  addEmployee(employee) {
    console.log(employee);
  }

  getStoresWhereUserWorks() {
    return this.crudService.getStoresWhereUserWorks();
  }

  optmizeImage(file) {
    return this.crudService.optmizeImage(file);
  }
}
