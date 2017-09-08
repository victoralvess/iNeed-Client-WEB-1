import { EventEmitter, Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
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

    constructor(private afAuth: AngularFireAuth,
                private verifyAuth: VerifyAuth) {
        this.user = afAuth.authState;
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

    /**
     * Responsável pelo acesso na consta usando e-mail e senha.
     * @param shopkeeper
     */
    signInWithEmail(shopkeeper: Shopkeeper) {
        this.afAuth.auth.signInWithEmailAndPassword(shopkeeper.email, shopkeeper.password)
            .then((success) => {
                console.log(success);
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
}
