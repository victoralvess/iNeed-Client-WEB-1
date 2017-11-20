import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { Http } from '@angular/http';
import { environment } from '../../../../environments/environment';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/map';

@Injectable()
export class VerifyAuth {

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
                if (foundUser.$exists()) {
                    if (foundUser.emailVerified) {
                        if (foundUser.profileVerified) {
                            console.log('registro completo');
                            this.router.navigate(['/shopkeeper/dashboard']);
                          /*  if (foundUser.auth0Id) { } else {
                                this.db.object(`users/${user.uid}`).update({ permissionLevel: 4 });
                            }*/
                            return this.CONDITIONS[0];
                        } else {
                            console.log('email ok; profile isnt ok');
                            this.router.navigate(['/subscribe/verification/admin']);
                            return this.CONDITIONS[1];
                        }
                    } else {
                        console.log('email isnt ok; profile isnt ok');
                        this.router.navigate(['/subscribe/verification/email']);
                        return this.CONDITIONS[2];
                    }
                } else {
                    console.log('registro incompleto');
                    this.router.navigate(['/subscribe/verification/email']);
                    this.usersRef
                        .child(`${user.uid}`)
                        .set({
                            uid: user.uid,
                            name: user.displayName,
                            emailVerified: user.emailVerified,
                            verificationSent: true, // WILL SEND THE EMAIL
                            profileVerified: false,
                            email: user.email,
                            permissionLevel: 4
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
        user.sendEmailVerification().then((success) => {
            this.usersRef.child(`${user.uid}`).update({ verificationSent: true });
        });
    }
}
