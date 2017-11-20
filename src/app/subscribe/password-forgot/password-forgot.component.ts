import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Shopkeeper } from '../../shared/models/shopkeeper.model';
import { AuthService } from '../../shared/services/services-auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CustomValidators } from '../../shared/validators/custom-validators';

@Component({
    selector: 'app-password-forgot',
    templateUrl: './password-forgot.component.html',
    styleUrls: ['./password-forgot.component.css']
})
export class PasswordForgotComponent implements OnInit {

    shopkeeper: Shopkeeper;
    btnLoading = false;
    shopkeeperLoggedStatus = true;

    recoverPasswdForm = new FormGroup({
        email: new FormControl('', Validators.compose([Validators.required, Validators.email]))
    });

    constructor(private authService: AuthService, private router: Router) {
    }

    ngOnInit() {
    }

    onClickForgot() {
        this.btnLoading = true;
        this.authService.forgotPassword(this.shopkeeper);
        this.authService.shopkeeperLogged.subscribe(result => {
            console.log(result);
            this.btnLoading = result;
            this.shopkeeperLoggedStatus = result;
            if (result) {
                this.router.navigate(['/subscribe/signin']);
            }
        });
    }

    recoverPasswd(formValue) {
console.log(formValue);
        this.shopkeeper = {email: formValue.email};
        this.btnLoading = true;
        this.authService.forgotPassword(this.shopkeeper);
        this.authService.shopkeeperLogged.subscribe(result => {
            console.log(result);
            this.btnLoading = result;
            this.shopkeeperLoggedStatus = result;
            if (result) {
                this.router.navigate(['/subscribe/signin']);
            }
        });
    }
}
