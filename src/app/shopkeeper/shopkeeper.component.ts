import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../shared/services/services-auth/auth.service';
import * as $ from 'jquery';
import { User } from 'firebase/app';
import { Subscription } from 'rxjs/Subscription';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';

@Component({
    selector: 'app-shopkeeper',
    templateUrl: './shopkeeper.component.html',
    styleUrls: ['./shopkeeper.component.css']
})
export class ShopkeeperComponent implements OnInit, OnDestroy {

    user: User;
    chosenInitialized = false;

    tiles = [
        {text: '© COPYRIGHT 2017 - iNeed, TODOS OS DIREITOS RESERVADOS', cols: 2, rows: 1},
        {text: 'Two', cols: 1, rows: 1},
        {text: 'Three', cols: 1, rows: 1},
    ];

    // HOME PROD LOJ FUN CHAT

    routes: any[] = [{
        icon: 'home',
        route: '/shopkeeper/dashboard/home',
        title: 'Home',
        target: '_self',
    }, {
        icon: 'shopping_basket',
        route: '/shopkeeper/dashboard/admin/products',
        title: 'Produtos',
        target: '_self',
    }, {
        icon: 'store',
        route: '/shopkeeper/dashboard/admin/stores',
        title: 'Lojas',
        target: '_self',
    }, {
        icon: 'people',
        route: '/shopkeeper/dashboard/admin/employees',
        title: 'Funcionários',
        target: '_self',
    }, {
        icon: 'chat',
        route: '/shopkeeper/chat',
        title: 'Chat',
        target: '_blank',
    }
    ];

    watcher: Subscription;
    activeMediaQuery = '';
    isDesktop = false;
    mode = 'over';

    constructor(private afAuth: AngularFireAuth, private service: AuthService, private router: Router, media: ObservableMedia) {
        this.user = afAuth.auth.currentUser;

        this.afAuth.auth.onAuthStateChanged((user) => {
            if (!user) {
                console.log('mata tuto chessus');
                this.router.navigate(['/subscribe/signin']);
            }
        });

        this.watcher = media.subscribe((change: MediaChange) => {
            this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
            if (change.mqAlias === 'xs' || change.mqAlias === 'sm') {
                this.isDesktop = false;
                this.mode = 'over';
            } else {
                this.isDesktop = true;
                this.mode = 'side';
            }
        });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.watcher.unsubscribe();
    }


    onClickLogout() {
        this.service.logout();
        this.router.navigate(['/home']);
    }

}
