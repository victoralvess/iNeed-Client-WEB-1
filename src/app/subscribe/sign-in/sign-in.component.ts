import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Shopkeeper } from '../../shared/models/shopkeeper.model';
import { AuthService } from '../../shared/services/services-auth/auth.service';
import { Auth0Service } from '../../shared/services/auth0-service/auth0.service';
import * as firebase from 'firebase/app';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CustomValidators } from '../../shared/validators/custom-validators';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

    shopkeeper: Shopkeeper;
    shopkeeperFirebase: Observable<firebase.User>;
    btnLoadingGoogle = false;
    btnLoadingEmail = false;
    shopkeeperLoggedStatus = true;

    signInForm = new FormGroup({
        email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
        password: new FormControl('', Validators.compose([Validators.required, CustomValidators.minLength(6), CustomValidators.maxLength(22)]))
    });

    constructor(public authService: AuthService, private auth0Service: Auth0Service, private router: Router, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon('google', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/google.svg'));
        iconRegistry.addSvgIcon('auth0', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/auth0.svg'));

        this.shopkeeperFirebase = this.authService.user;
    }

    ngOnInit() {
    }

    signInWithGoogle() {
        console.log(this.shopkeeper);
        this.btnLoadingGoogle = true;
        this.authService.signInWithGoogle();
        this.authService.shopkeeperLogged.subscribe(result => {
            console.log(result);
            this.shopkeeperLoggedStatus = result;
            this.btnLoadingGoogle = result;
            this.router.navigate([`/shopkeeper/dashboard/home`]);
        });
    }

    signInAsShopkeeper() {
        this.auth0Service.employeeLogin();
    }

    signInWithEmail(formValues) {
this.shopkeeper = {};
        this.shopkeeper.email = formValues.email;
        this.shopkeeper.password = formValues.password;
        console.log(this.shopkeeper);
        this.btnLoadingEmail = true;
        this.authService.signInWithEmail(this.shopkeeper);
        this.authService.shopkeeperLogged.subscribe(result => {
            console.log(result);
            this.shopkeeperLoggedStatus = result;
            this.btnLoadingEmail = result;
            this.router.navigate([`/shopkeeper/dashboard/home`]);
        });
    }
}
