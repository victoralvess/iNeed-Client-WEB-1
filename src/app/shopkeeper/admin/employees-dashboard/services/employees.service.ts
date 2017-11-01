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
    return this.db.list(`/employees-stores/${thisStore}`);
  }

  addEmployee(employee) {
    console.log(employee);
    this.auth0Service.employeeLogin();/*
    const signedUp = this.auth0Service.signUp({
      email: employee.email, password: 'DEFAULT', user_metadata: {
        name: employee.name,
        login: employee.login,
        permissionLevel: `${employee.permissionLevel}`// ,
        // stores: employee.stores // ONLY-STRINGS
      }
    }, this.signUp$);
    /*name
    email
    login
    permissionLevel
    stores*/
  }

  getStoresWhereUserWorks() {
    return this.crudService.getStoresWhereUserWorks();
  }

  optmizeImage(file) {
    return this.crudService.optmizeImage(file);
  }
}
