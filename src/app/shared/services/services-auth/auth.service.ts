import { EventEmitter, Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/retry';
import { Shopkeeper } from '../../models/shopkeeper.model';
import { VerifyAuth } from '../verify-auth/verify-auth';

@Injectable()
export class AuthService {

    user: Observable<firebase.User>;
    private accCondition: Observable<string>;
    shopkeeperLogged = new EventEmitter<boolean>();
    userData: any = {};
    constructor(private afAuth: AngularFireAuth,
        private verifyAuth: VerifyAuth,
        private db: AngularFireDatabase) {
        this.user = afAuth.authState;


        if (afAuth.auth.currentUser) {
            this.userData = {
                email: afAuth.auth.currentUser.email,
                emailVerified: afAuth.auth.currentUser.emailVerified,
                name: afAuth.auth.currentUser.displayName,
                uid: afAuth.auth.currentUser.uid
            };

            db.object(`users/${afAuth.auth.currentUser.uid}`).update(this.userData);
        }
    }

    /**
     * Responsável pelo acesso social usando o Google.
     */
    signInWithGoogle() {
        this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
            .then((success) => {
                console.log(success);
                this.verifyAuth.verifyProfile(this.accCondition);
                this.shopkeeperLogged.emit(true);
            }, (err) => {
                console.log(err);
                this.shopkeeperLogged.emit(false);
            });
    }

    signUpWithGoogle() {
        this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
            .then((success) => {
                console.log(success);

                this.userInitialize();

                this.verifyAuth.verifyProfile(this.accCondition);
                this.shopkeeperLogged.emit(true);
            }, (err) => {
                console.log(err);
                this.shopkeeperLogged.emit(false);
            });
    }

    /**
     * Responsável pelo acesso na consta usando e-mail e senha.
     * @param shopkeeper
     */
    signInWithEmail(shopkeeper: Shopkeeper) {
        this.afAuth.auth.signInWithEmailAndPassword(shopkeeper.email, shopkeeper.password)
            .then((success) => {
                console.log(success);
                /*if (this.afAuth.auth.currentUser) {
                    this.userData = {
                        email: this.afAuth.auth.currentUser.email,
                        emailVerified: this.afAuth.auth.currentUser.emailVerified,
                        name: this.afAuth.auth.currentUser.displayName,
                        uid: this.afAuth.auth.currentUser.uid
                    };

                    this.db.object(`users/${this.afAuth.auth.currentUser.uid}`).update(this.userData);
                }*/
                this.verifyAuth.verifyProfile(this.accCondition);
                this.shopkeeperLogged.emit(true);
            }, (err) => {
                console.log(err);
                this.shopkeeperLogged.emit(false);
            });
    }

    /**
     * Responsável pela criação da conta usando e-mail e senha.
     * @param shopkeeper
     */
    signUpWithEmail(shopkeeper: Shopkeeper) {
        this.afAuth.auth.createUserWithEmailAndPassword(shopkeeper.email, shopkeeper.password)
            .then((success) => {
                success.updateProfile({
                    displayName: shopkeeper.name
                });

                this.userInitialize(shopkeeper.name);

                this.verifyAuth.verifyProfile(this.accCondition);
                this.shopkeeperLogged.emit(true);
            }, (err) => {
                console.log(err);
                this.shopkeeperLogged.emit(false);
            });
    }

    /**
     * Responsável pela recuperação da senha.
     * @param shopkeeper
     */
    forgotPassword(shopkeeper: Shopkeeper) {
        this.afAuth.auth.sendPasswordResetEmail(shopkeeper.email)
            .then((success) => {
                console.log(success);
                this.shopkeeperLogged.emit(true);
            }, (err) => {
                console.log(err);
                this.shopkeeperLogged.emit(false);
            });
    }

    logout() {
        this.afAuth.auth.signOut();
    }

    userInitialize(name?) {
        if (this.afAuth.auth.currentUser) {
            this.db.object(`users/${this.afAuth.auth.currentUser.uid}`).subscribe((user) => {
                if (user.auth0Id) { } else {
                    this.userData = {
                        email: this.afAuth.auth.currentUser.email,
                        emailVerified: this.afAuth.auth.currentUser.emailVerified,
                        name: name || this.afAuth.auth.currentUser.displayName,
                        uid: this.afAuth.auth.currentUser.uid
                    };
                    if (user.permissionLevel) { } else {
                        this.userData.permissionLevel = 4;
                        this.userData.profileVerified = false;
                        this.userData.verificationSent = false;
                        this.db.object(`users/${this.afAuth.auth.currentUser.uid}`).update(this.userData);
                    }
                }
            });
        }
    }
}
