import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Shopkeeper } from '../../shared/models/shopkeeper.model';
import { AuthService } from '../../shared/services/services-auth/auth.service';
import * as firebase from 'firebase/app';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

    shopkeeper: Shopkeeper;
    shopkeeperFirebase: Observable<firebase.User>;
    btnLoadingGoogle: boolean = false;
    btnLoadingEmail: boolean = false;
    shopkeeperLoggedStatus: boolean = true;

    constructor(public authService: AuthService) {
        this.shopkeeper = new Shopkeeper();

        this.shopkeeperFirebase = this.authService.user;
    }

    ngOnInit() {
    }

    onClickSignInGoogle() {
        console.log(this.shopkeeper);
        this.btnLoadingGoogle = true;
        this.authService.signInWithGoogle();
        this.authService.shopkeeperLogged.subscribe( result => {
            console.log(result);
            this.shopkeeperLoggedStatus = result;
            this.btnLoadingGoogle = result;
        });
    }

    onClickSignIn() {
        console.log(this.shopkeeper);
        this.btnLoadingEmail = true;
        this.authService.signInWithEmail(this.shopkeeper);
        this.authService.shopkeeperLogged.subscribe( result => {
            console.log(result);
            this.shopkeeperLoggedStatus = result;
            this.btnLoadingEmail = result;
        });
    }
}
