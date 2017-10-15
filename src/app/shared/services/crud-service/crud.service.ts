import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { Http } from '@angular/http';
import * as firebase from 'firebase';
import { environment } from '../../../../environments/environment';

@Injectable()
export class CrudService {

    user: firebase.User;

    constructor(public db: AngularFireDatabase, private http: Http) {
        this.user = firebase.auth().currentUser;
    }

    getUser() {
        return this.db.object(`users/${this.user.uid}`);
    }

    getAllCategories() {
        return this.db.list(`/categories`);
    }

    optmizeImage(file) {
        return this.http.post(`${environment.apis.ineed.optmization.url}/ws/0/optmize`, file);
    }

    unique() {
        let d = new Date().getTime();
        return 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
}
