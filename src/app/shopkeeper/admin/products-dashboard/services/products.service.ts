import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../../../../shared/services/services-auth/auth.service';
import { Http } from '@angular/http';

import * as firebase from 'firebase';

import { Subject } from 'rxjs/Subject';

import { NotificationsService } from '../../../../shared/services/notifications/notifications.service';
import { Message } from 'primeng/primeng';
import { Router } from '@angular/router';

@Injectable()
export class ProductsService {

    optimizationAPI = 'https://2need.store';

    user: firebase.User;
    databaseChanged = new Subject<Message>();
    pictureAdded = new Subject<any>();
    picsUploaded = {};
    picIndex = {};

    constructor(public db: AngularFireDatabase, private auth: AuthService, private http: Http, private notifications: NotificationsService, private router: Router) {
        this.user = firebase.auth().currentUser;
        this.pictureAdded.asObservable().subscribe((product) => {
            console.log('picsUp', this.picsUploaded);

            this.db.app.database().ref(`/products/${product.key}/pictures/${this.picsUploaded[product.key]}`).set(product.url);
            this.db.app.database().ref(`/products-stores/${product.store}/${product.key}/pictures/${this.picsUploaded[product.key]}`).set(product.url);
            product.categories.forEach((category) => {
                this.db.app.database().ref(`/products-categories/${category}/${product.key}/pictures/${this.picsUploaded[product.key]}`).set(product.url);
            });

            this.picsUploaded[product.key]++;
        });
    }

    getUser() {
        return this.db.object(`users/${this.user.uid}`);
    }

    getStoresWhereUserWorks() {
        return this.db.list(`/employees-stores/${this.user.uid}`);
    }

    getAllCategories() {
        return this.db.list(`/categories`);
    }

    getProductsFrom(thisStore) {
        return this.db.list(`/products-stores/${thisStore}`);
    }

    addProduct(product) {
        product.stores.forEach((store) => {
            const newProduct: any = {
                name: product.name,
                description: product.description,
                price: product.price,
                store: store,
                categories: product.selectedCategories,
                upVotesCount: 0,
                downVotesCount: 0
            };

            const productsRef = this.db.app.database().ref(`/products`);
            const key = productsRef.push().key;
            newProduct.id = key;

            this.db.app.database().ref(`/products/${key}`).set(newProduct);
            this.picsUploaded[key] = 0;

            this.db.app.database().ref(`/products-stores/${store}/${key}`).set(newProduct);
            this.picIndex[key] = 0;
            product.selectedCategories.forEach((category) => {
                this.db.app.database().ref(`/products-categories/${category}/${key}`).set(newProduct);
            });

            (<string[]>product.images).forEach((image) => {
                firebase.storage().ref(`/${store}/${key}/${this.unique()}.jpeg`).putString(image, 'data_url', {
                    contentType: 'image/jpeg'
                }).then((snapshot) => {
                    console.log('dUrl', snapshot.downloadURL);
                    this.pictureAdded.next({
                        key: key,
                        store: store,
                        categories: product.selectedCategories,
                        url: snapshot.downloadURL
                    });
                });

                this.picIndex[key]++;

            });

            this.verifyChangesOnProducts(key, 'Sucesso!', 'O produto foi cadastrado com êxito!');
            this.router.navigate(['/shopkeeper/dashboard/admin/products']);
        });
    }

    updateProduct(product, sendPics: any[], originalUrls: any[]) {
        this.picsUploaded[product.productId] = sendPics.length;
        console.log(this.picsUploaded[product.productId], sendPics);
        const updatedProduct = {
            name: product.name,
            description: product.description,
            price: product.price,
            categories: product.selectedCategories,
            store: product.productStore,
            pictures: sendPics,
            upVotes: product.upVotes,
            downVotes: product.downVotes,
            upVotesCount: product.upVotesCount,
            downVotesCount: product.downVotesCount,
        };

        originalUrls.forEach((url) => {
            if (!sendPics.includes(url)) {
                firebase.storage().refFromURL(url).delete();
            }
        });

        this.db.app.database().ref(`/products/${product.productId}`).set(updatedProduct);
        this.db.app.database().ref(`/products-stores/${product.productStore}/${product.productId}`).set(updatedProduct);
        product.selectedCategories.forEach((category) => {
            this.db.app.database().ref(`/products-categories/${category}/${product.productId}`).set(updatedProduct);
        });

        if ((<string[]>product.images).length > 0) {
            (<string[]>product.images).forEach((image) => {
                firebase.storage().ref(`/${product.productStore}/${product.productId}/${this.unique()}.jpeg`).putString(image, 'data_url', {
                    contentType: 'image/jpeg'
                }).then((snapshot) => {
                    console.log('dUrl', snapshot.downloadURL);
                    this.pictureAdded.next({
                        key: product.productId,
                        store: product.productStore,
                        categories: product.selectedCategories,
                        url: snapshot.downloadURL
                    });
                });
            });
        }
        this.verifyChangesOnProducts(product.productId, 'Sucesso!', 'O produto foi atualizado com êxito!');
    }

    deleteProduct(key, categories, store, picsQty) {
        this.db.object(`/products/${key}`).subscribe((product) => {
            if (product.pictures) {
                product.pictures.forEach((url) => {
                    firebase.storage().refFromURL(url).delete();
                });
                this.db.app.database().ref(`/products/${key}`).remove();
            }
        });

        this.db.app.database().ref(`/products-stores/${store}/${key}`).remove();
        categories.forEach((category) => {
            this.db.app.database().ref(`/products-categories/${category}/${key}`).remove();
        });
    }

    verifyChangesOnProducts(productKey, successSummary, successMessage) {
        this.db.app.database().ref(`/products/${productKey}`).once('value', (s) => {
            this.databaseChanged.next(this.notifications.success(successSummary, successMessage));
        });
    }

    optmizeImage(file) {
        return this.http.post(`${this.optimizationAPI}/ws/0/optmize`, file);
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
