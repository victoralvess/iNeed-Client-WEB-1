import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import * as auth0 from 'auth0-js';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../../../environments/environment';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class Auth0Service {

    auth0 = new auth0.WebAuth(environment.apis.ineed.auth0);

    public signedUp = new Subject<boolean>();

    constructor(public router: Router, private afAuth: AngularFireAuth) { }

    public signUp(user: User, observer: Subject<boolean>) {
        this.auth0.signup({
            connection: 'DefaultApp',
            email: user.email,
            password: user.password,
            user_metadata: user.user_metadata
        }, function (err) {
            console.log(err);
            if (err) {
                observer.next(false);
            } else {
                observer.next(true);
            }
        });
    }

    public employeeLogin(): void {
        this.auth0.authorize();
    }

    public handleAuthentication(): void {
        this.auth0.parseHash((parseError, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                window.location.hash = '';
                console.log(authResult);
                new auth0.Management({
                    domain: 'default-tenant.auth0.com',
                    token: authResult.idToken
                }).getUser(authResult.idTokenPayload.sub, (managementError, res) => {
                    console.log(res.app_metadata.authToken);
                    this.afAuth.auth.signInWithCustomToken(res.app_metadata.authToken).then((success) => {
                        console.log(success);
                    });
                });
                this.setSession(authResult);
                this.router.navigate(['/shopkeeper/dashboard/home']);
            } else if (parseError) {
                console.log(parseError);
            }
        });
    }

    private setSession(authResult): void {
        const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
    }

    public logout(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        this.router.navigate(['/']);
    }

    public isAuthenticated(): boolean {
        const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }

}

export interface User {
    email: string;
    password: string;
    user_metadata: object;
}
