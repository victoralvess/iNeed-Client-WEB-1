import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../../shared/services/services-auth/auth.service';
import { AngularFireDatabase } from 'angularfire2/database';
<<<<<<< HEAD
import { environment } from 'environments/environment';
=======
import { environment } from '../../../../environments/environment';
>>>>>>> stores-module

import 'rxjs/add/operator/map';

@Injectable()
export class IsLoggedAuthGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService, private db: AngularFireDatabase ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot ): Observable<boolean> | boolean {
        const user = JSON.parse(localStorage.getItem(`firebase:authUser:${environment.firebase.apiKey}:[DEFAULT]`));
        console.log(user);
        let canActivate;
        if (user != null) {
            console.log('user != null');
            return this.db.object(`users/${user.uid}`)
                .map((currentUser) => {
                    canActivate = currentUser.emailVerified && currentUser.profileVerified;
                    if (canActivate) {
                        console.log('can t');
                        this.router.navigate(['/shopkeeper/dashboard']);
                        return false;
                    }
                    console.log(canActivate);
                    return true;
                });
        } else {
            console.log('user === null');
            return true;
        }
    }
}