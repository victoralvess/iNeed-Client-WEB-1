import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import * as auth0 from 'auth0-js';
import { Subject } from 'rxjs/Subject';
import * as firebase from 'firebase/app';
import { environment } from '../../../../environments/environment';
import { JwtHelper } from 'angular2-jwt';

@Injectable()
export class Auth0Service {

    auth0 = new auth0.WebAuth({
        domain: 'default-tenant.auth0.com',
        clientID: 'bK8ww4-EDzJUgz-lcdg5JTRz8hCPtTQi',
        redirectUri: 'http://localhost:4200/callback',
        responseType: 'token id_token',
        scope: 'openid profile'
    });

    public signedUp = new Subject<boolean>();
    jwtHelper = new JwtHelper();

    constructor(public router: Router) { }

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
            }
            observer.next(true);
        });
    }

    public employeeLogin(): void {
        this.auth0.authorize();
    }

    public handleAuthentication(): void {
        this.auth0.parseHash((parseError, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                firebase.initializeApp(environment.firebase);
                if (authResult.mytoken) {
                    firebase.auth().signInWithCustomToken(authResult.mytoken).then((success) => {
                        console.log(success);
                    });
                }
                /*const decoded = this.jwtHelper.decodeToken(authResult.idToken);
                let firebaseToken: any = {};
                firebaseToken.uid = (<string>authResult.idTokenPayload.sub).split('|')[1];
                firebaseToken.aud = 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit';
                firebaseToken.iss = 'firebase-adminsdk-lwsop@default-project-d4f76.iam.gserviceaccount.com';
                firebaseToken.sub = 'firebase-adminsdk-lwsop@default-project-d4f76.iam.gserviceaccount.com';
                firebaseToken.iat = decoded.iat;
                firebaseToken.exp = decoded.exp;
                firebaseToken.claims = {
                    admin: true
                };
                const parts = authResult.idToken.split('.');
                console.log(`${parts[0]}.${btoa(JSON.stringify(firebaseToken))}.${parts[2]}`);
                firebase.auth().signInWithCustomToken(`${parts[0]}.${btoa(JSON.stringify(decoded))}.${parts[2]}`).then((success) => {
                    console.log(success);
                }); */
                window.location.hash = '';
                console.log(authResult);
                new auth0.Management({
                    domain: 'default-tenant.auth0.com',
                    token: authResult.idToken
                }).getUser(authResult.idTokenPayload.sub, (managementError, res) => {
                    console.log(res.app_metadata.authToken);
firebase.auth().signInWithCustomToken(res.app_metadata.authToken).then((success) => {
                        console.log(success);
                    });
                });
                this.setSession(authResult);
                this.router.navigate(['/home']);
            } else if (parseError) {
                this.router.navigate(['/home']);
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
