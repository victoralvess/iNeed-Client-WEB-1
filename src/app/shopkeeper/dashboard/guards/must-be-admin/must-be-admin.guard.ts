import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AuthService } from '../../../../shared/services/services-auth/auth.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { environment } from 'environments/environment';

@Injectable()
export class MustBeAdminGuard implements CanActivate {

	constructor(private router: Router, private authService: AuthService, private db: AngularFireDatabase ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const user = JSON.parse(localStorage.getItem(`firebase:authUser:${environment.firebase.apiKey}:[DEFAULT]`));

    let canActivate;
    if (user != null) {
      return this.db.object(`users/${user.uid}`)
      .map((currentUser) => {
        canActivate = (currentUser.permissionLevel == 2 || currentUser.permissionLevel == 3);
        if (!canActivate) {
          this.router.navigate(['/shopkeeper/dashboard/home']);
          return false;
        }
        return true; 
      });
    } else {
      this.router.navigate(['/subscribe']);
      return false;
    }
  }
}
  