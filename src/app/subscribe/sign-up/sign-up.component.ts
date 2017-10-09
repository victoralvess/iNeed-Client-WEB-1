import { Component, OnInit } from '@angular/core';

import { Shopkeeper } from '../../shared/models/shopkeeper.model';
import { AuthService } from '../../shared/services/services-auth/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  shopkeeper: Shopkeeper;
  btnLoadingGoogle: boolean = false;
  btnLoadingEmail: boolean = false;
  shopkeeperLoggedStatus: boolean = true;

  constructor(private authService: AuthService) {
    this.shopkeeper = new Shopkeeper();
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

  onClickSignUp() {
    console.log(this.shopkeeper);
    this.btnLoadingEmail = true;
    this.authService.signUpWithEmail(this.shopkeeper);
    this.authService.shopkeeperLogged.subscribe( result => {
      console.log(result);
      this.shopkeeperLoggedStatus = result;
      this.btnLoadingEmail = result;
    });
  }
}
