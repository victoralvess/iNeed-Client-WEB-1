import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../../../../shared/services/services-auth/auth.service';

import * as firebase from 'firebase/app';
import { CrudService } from '../../../../shared/services/crud-service/crud.service';
import { Auth0Service } from '../../../../shared/services/auth0-service/auth0.service';
import { Subject } from 'rxjs/Subject';
import * as auth0 from 'auth0-js';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class EmployeesService {

  user: firebase.User;
  signUp$ = new Subject<boolean>();
  update$ = new Subject<boolean>();

  constructor(private http: Http, public db: AngularFireDatabase, private auth: AuthService, private crudService: CrudService, private auth0Service: Auth0Service) {
    this.user = firebase.auth().currentUser;
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
    this.db.object(`users/${this.user.uid}`).subscribe((userFirebase) => {
      let boss;
      if (userFirebase.boss) {
        boss = userFirebase.boss;
      } else {
        boss = this.user.uid;
      }
      const signedUp = this.auth0Service.signUp({
        email: employee.email, password: employee.password, user_metadata: {
          name: employee.name,
          permissionLevel: `${employee.permissionLevel}`,
          worksAt: employee.stores,
          boss: boss
        }
      }, this.signUp$);
    });
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
    this.update$.next(true);
  }

  deleteEmployee(id, storeId?) {
    if (storeId) {
      this.db.app.database().ref(`employees-stores/${id}/${storeId}`).remove();
      this.db.app.database().ref(`stores-employees/${storeId}/${id}`).remove();
    } else {
      this.db.list(`employees-stores/${id}`).subscribe((storesList) => {
        storesList.forEach((store) => {
          this.db.object(`/stores-employees/${store.id}/${id}`).remove();
        });
        this.db.list(`employees-stores/${id}`).remove();
      });
      this.db.app.database().ref(`users/${id}`).once('value', (snapshot) => {
        this.http.post('https://default-tenant.auth0.com/oauth/token', {
          grant_type: 'client_credentials',
          client_id: 'bK8ww4-EDzJUgz-lcdg5JTRz8hCPtTQi',
          client_secret: '2fJ6PbF2QRZo5gF0_rQKECSrX_XGj5zUTjVHWIIENqQzcDMD_rtuztCF22lg1XES',
          audience: 'https://default-tenant.auth0.com/api/v2/'
        })
          .map((res) => res.json())
          .subscribe((res) => {
            let management = new auth0.Management({
              domain: 'default-tenant.auth0.com',
              token: res.access_token
            });
            let headers = new Headers();
            headers.append('Authorization', 'Bearer  ' + res.access_token);
            this.http.delete('https://default-tenant.auth0.com/api/v2/users/' + snapshot.val().auth0Id, { headers: headers }).subscribe(function (res) { console.log(res) });
          });
        this.db.app.database().ref(`users/${id}`).remove();
      });
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
