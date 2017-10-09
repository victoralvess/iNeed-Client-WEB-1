import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { Http } from '@angular/http';
import { environment } from '../../../../environments/environment';
import 'rxjs/add/operator/retry';
<<<<<<< HEAD
=======
import 'rxjs/add/operator/map';
>>>>>>> stores-module

@Injectable()
export class VerifyAuth {

    private verificationUrl = 'https://us-central1-default-project-d4f76.cloudfunctions.net/sendVerificationEmail';
    private tokenUrl = 'https://us-central1-default-project-d4f76.cloudfunctions.net/generateToken';
    private user: Observable<firebase.User>;
    private CONDITIONS: string[] = ['ALL_VERIFIED', 'MISSED_ADMIN_VERIFICATION', 'MISSED_EMAIL_VERIFICATION'];
    private usersRef = firebase.database().ref(`users`);

    constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private http: Http, private router: Router) {
        this.user = afAuth.authState;
    }

    /**
     * Método auxiliar para a verificação de acesso do usuário.
     * @param observable
     */
    verifyProfile(observable: Observable<String>) {
        observable = this.registrationIsCompleted(this.afAuth.auth.currentUser);
        console.log(observable);
        observable.subscribe((condition) => {
            console.log('condition' + this.registrationIsCompleted(this.afAuth.auth.currentUser));
            switch (condition) {
                case this.CONDITIONS[0]:
                    break;
                case this.CONDITIONS[1]:
                    break;
                case this.CONDITIONS[2]:
                    this.sendEmailVerification(this.afAuth.auth.currentUser);
                    break;
            }
        });
    }

    /**
     * Verificação do estado da conta.
     * Verificação se o usuário tem permissão de acesso.
     * Chamada do component resposavel.
     * @param user
     * @returns {Observable<R>}
     */
    private registrationIsCompleted(user: firebase.User) {
        return this.db.object(`users/${user.uid}`)
            .map((foundUser) => {
                console.log(user);
                console.log(foundUser);
<<<<<<< HEAD
                if (foundUser.$exists()) {
                    if (foundUser.emailVerified) {
                        if (foundUser.profileVerified) {
=======
                if (foundUser.payload.exists()) {
                    if (foundUser.payload.val().emailVerified) {
                        if (foundUser.payload.val().profileVerified) {
>>>>>>> stores-module
                            console.log('registro completo');
                            this.router.navigate(['/shopkeeper/dashboard']);
                            return this.CONDITIONS[0];
                        } else {
                            console.log('email ok; profile isnt ok');
                            this.router.navigate(['/subscribe/adminverication']);
                            return this.CONDITIONS[1];
                        }
                    } else {
                        console.log('email ok; profile isnt ok');
                        this.router.navigate(['/subscribe/emailverication']);
                        return this.CONDITIONS[2];
                    }
                } else {
                    console.log('registro incompleto');
                    this.router.navigate(['/subscribe/emailverication']);
                    this.usersRef
                        .child(`${user.uid}`)
                        .set({
                            uid: user.uid,
                            emailVerified: false,
                            verificationSent: false,
                            profileVerified: false,
                            email: user.email
                        });
                    return this.CONDITIONS[2];
                }
            });
    }

    /**
     * Responsável pelo envio da confirmação da conta.
     * Sem a ativação da conta o usuário não consegue entrar na sua conta.
     * @param user
     */
    private sendEmailVerification(user: firebase.User) {
        this.usersRef
            .child(`${user.uid}`)
            .once('value', (snapshot) => {
                if (!(snapshot.val().verificationSent)) {
                    this.http.get(`${this.tokenUrl}?apiKey=${environment.firebase.apiKey}&uid=${user.uid}&email=${user.email}`)
                        .retry(3)
                        .map(response => response.json())
                        .subscribe(response => {
                            console.log(response);
                            this.http.get(`${this.verificationUrl}?userId=${user.uid}&userName=${user.displayName}&email=${user.email}&code=${response}&apiKey=${environment.firebase.apiKey}`)
                                .retry(3)
                                .subscribe(() => {
                                    console.log(`${this.verificationUrl}?userId=${user.uid}&userName=${user.displayName}&email=${user.email}&code=${response}&apiKey=${environment.firebase.apiKey}`);
                                    this.usersRef
                                        .child(`${user.uid}`)
                                        .update({
                                            verificationSent: true
                                        })
                                });
                        });
                }
            });
    }
}
