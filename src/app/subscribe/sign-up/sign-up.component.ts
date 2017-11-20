import { Component, OnInit } from '@angular/core';

import { Shopkeeper } from '../../shared/models/shopkeeper.model';
import { AuthService } from '../../shared/services/services-auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CustomValidators } from '../../shared/validators/custom-validators';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  shopkeeper: Shopkeeper;
  btnLoadingGoogle = false;
  btnLoadingEmail = false;
  shopkeeperLoggedStatus = true;

  signUpForm = new FormGroup({
    name: new FormControl('', Validators.compose([Validators.required, CustomValidators.minLength(3), CustomValidators.maxLength(40)])),
    email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
    password: new FormControl('', Validators.compose([Validators.required, CustomValidators.minLength(6), CustomValidators.maxLength(22)]))
  });

  constructor(private authService: AuthService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('google', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/google.svg'));
  }

  ngOnInit() {
  }

  signUpWithEmail(formValues) {
this.shopkeeper = {};
    this.shopkeeper.email = formValues.email;
    this.shopkeeper.name = formValues.name;
    this.shopkeeper.password = formValues.password;

    this.authService.signUpWithEmail(this.shopkeeper);
    this.authService.shopkeeperLogged.subscribe(result => {
      console.log(result);
      this.shopkeeperLoggedStatus = result;
      this.btnLoadingEmail = result;
    });
  }

  signUpWithGoogle() {
    console.log(this.shopkeeper);
    this.btnLoadingGoogle = true;
    this.authService.signUpWithGoogle();
    this.authService.shopkeeperLogged.subscribe(result => {
      console.log(result);
      this.shopkeeperLoggedStatus = result;
      this.btnLoadingGoogle = result;
    });
  }
}
