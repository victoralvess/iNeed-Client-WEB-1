import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Shopkeeper } from '../../shared/models/shopkeeper.model';
import { AuthService } from '../../shared/services/services-auth/auth.service';

@Component({
    selector: 'app-password-forgot',
    templateUrl: './password-forgot.component.html',
    styleUrls: ['./password-forgot.component.css']
})
export class PasswordForgotComponent implements OnInit {

    shopkeeper: Shopkeeper;
    btnLoading: boolean = false;
    shopkeeperLoggedStatus: boolean = true;

    constructor(private authService: AuthService, private router: Router) {
        this.shopkeeper = new Shopkeeper();
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
}
